import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import express from 'express';
import Session from 'cookie-session';
import { PrismaClient } from '@prisma/client';
import { applyMiddleware } from 'graphql-middleware';
import { generateNonce, SiweErrorType, SiweMessage } from 'siwe';
import { LinearClient } from '@linear/sdk';

import { resolvers } from './prisma/generated/type-graphql';
import { customResolvers } from './prisma/resolvers';
import { graphqlHTTP } from 'express-graphql';
import fetch from 'cross-fetch';
import { permissions } from './permissions';

import cors = require('cors');

console.log('Starting');
const prisma = new PrismaClient();

const LINEAR_TOKEN_URL = 'https://api.linear.app/oauth/token';
const LINEAR_REDIRECT_URI = process.env.LINEAR_REDIRECT_URI;
const LINEAR_CLIENT_ID = process.env.LINEAR_CLIENT_ID;
const LINEAR_CLIENT_SECRET = process.env.LINEAR_CLIENT_SECRET;
const PROTOCOL_FRONTEND = process.env.PROTOCOL_FRONTEND;

const typeSchema = buildSchemaSync({
  resolvers: [...resolvers, ...customResolvers],
});

const schema = applyMiddleware(typeSchema, permissions);

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(','),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);
app.use(
  Session({
    name: 'govrn',
    secret: process.env['PROTOCOL_COOKIE_SECRET'],
    secure: false,
    sameSite: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);
app.use('/graphql', async function (req, res) {
  const mid = graphqlHTTP({
    schema,
    graphiql: true,
    context: {
      prisma,
      req,
    },
  });
  return mid(req, res);
});
app.post('/verify', async function (req, res) {
  try {
    if (!req.body.message) {
      res
        .status(422)
        .json({ message: 'Expected prepareMessage object as body.' });
      return;
    }
    const message = new SiweMessage(req.body.message);
    const fields = await message.validate(req.body.signature);
    if (fields.data.nonce !== req.session.nonce) {
      res.status(422).json({ message: 'Invalid nonce' });
      return;
    }
    req.session.siwe = fields;
    res.status(200).end();
  } catch (e) {
    req.session.siwe = null;
    req.session.nonce = null;
    console.error(e);
    switch (e) {
      case SiweErrorType.EXPIRED_MESSAGE: {
        res.status(440).json({ message: e.message });
        break;
      }
      case SiweErrorType.INVALID_SIGNATURE: {
        res.status(422).json({ message: e.message });
        break;
      }
      default: {
        res.status(500).json({ message: e.message });
        break;
      }
    }
  }
});

app.get('/siwe/active', async function (req, res) {
  const fields = req.session.siwe;
  if (!fields?.data) {
    res.status(422).json({ message: 'No existing session cookie' });
  } else if (fields?.data?.nonce !== req.session.nonce) {
    res.status(422).json({ message: 'Invalid nonce' });
  } else if (new Date(fields?.data?.expirationTime) <= new Date()) {
    res.status(440).json({ message: 'Token has expired' });
  } else if (req.query.address !== req.session.siwe.data.address) {
    res
      .status(422)
      .json({ message: 'Signature is associated with another address' });
  }

  res.end();
});

app.post('/logout', async function (req, res) {
  req.session = null;
  res.status(200).end();
});

app.get('/nonce', async function (req, res) {
  const nonce = generateNonce();
  req.session.nonce = nonce;
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(req.session.nonce);
});

app.get('/linear_nonce', async function (req, res) {
  const nonce = generateNonce();
  req.session.linearNonce = nonce;
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(req.session.nonce);
});

// TODO: normalize all addresses to lowercase
app.get('/linear/oauth', async function (req, res) {
  try {
    const query = req.query;
    const code = query.code;
    const state = query.state.toString();
    const params = new URLSearchParams();
    params.append('code', code.toString());
    params.append('redirect_uri', LINEAR_REDIRECT_URI);
    params.append('client_id', LINEAR_CLIENT_ID);
    params.append('client_secret', LINEAR_CLIENT_SECRET);
    params.append('state', state);
    params.append('grant_type', 'authorization_code');
    const resp = await fetch(LINEAR_TOKEN_URL, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const respJSON = await resp.json();
    const client = new LinearClient({ accessToken: respJSON.access_token });
    const me = await client.viewer;
    const [, address] = state.split('/');

    await prisma.linearUser.upsert({
      create: {
        active: me.active,
        displayName: me.displayName,
        email: me.email,
        linear_id: me.id,
        name: me.name,
        url: me.url,
        access_token: respJSON.access_token,
        active_token: true,
        user: { connect: { address: address } },
      },
      where: { linear_id: me.id },
      update: {
        access_token: respJSON.access_token,
        active_token: true,
        user: { connect: { address: address } },
      },
    });

    res.status(200).redirect(PROTOCOL_FRONTEND + '/#/profile');
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

console.log('listening');
app.listen(4000);
