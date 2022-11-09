import { GovrnProtocol, SortOrder } from '@govrn/protocol-client';

export type ContributionData = {
  contribution_id?: number;
  name: string;
  status_name: string;
  activity_type_id: number;
  user_id: number;
  date_of_engagement: Date;
  date_of_submission: Date;
  details?: string;
  proof?: string;
  on_chain_id: number;
  /* Chain ID itself, not the id of chain record in db. */
  chain_id: number;
  txHash: string;
};

const PROTOCOL_URL = process.env.PROTOCOL_URL;
const CONTRACT_SYNC_TOKEN = process.env.CONTRACT_SYNC_TOKEN;

export const govrn = new GovrnProtocol(PROTOCOL_URL, null, {
  Authorization: CONTRACT_SYNC_TOKEN,
});

export const getOrInsertUser = async (data: {
  address: string;
}): Promise<number> => {
  // Query existing user.
  const user = await govrn.user.list({
    where: {
      address: { equals: data.address },
    },
    first: 1,
  });

  // Returns the id, if user exists.
  if (user.length === 1) {
    return user[0]?.id;
  }

  // Insert new user into db, if user doesn't exist.
  const newUser = await govrn.user.create({
    address: data.address,
    username: data.address,
  });

  return newUser.id;
};

export const getOrInsertActivityType = async (data: {
  name: string;
}): Promise<number> => {
  // Check for an existing activity types.
  const activityTypeId = await govrn.activity_type.list({
    where: { name: { equals: data.name } },
    first: 1,
  });
  if (activityTypeId.length > 0) return activityTypeId[0].id;

  // if there are no activity type, create new one.
  const activityTypeCreate = await govrn.activity_type.create({
    data: { name: data.name },
  });
  return activityTypeCreate.id;
};

export async function getContribution(data: { tokenId: number }) {
  try {
    const contrs = (
      await govrn.contribution.list({
        where: { on_chain_id: { equals: data.tokenId } },
        first: 1,
      })
    ).result;

    if (contrs.length != 0) return contrs[0].id;
    throw new Error('Contribution must exist for this attestation!');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const getIdOfChain = async (chainId: number) => {
  const chain = await govrn.chain.get({ where: { chain_id: `${chainId}` } });
  return chain.id;
};

export const upsertContribution = async (contribution: ContributionData) => {
  console.log(
    `:: Upsert Contribution with on chain id ${contribution.on_chain_id} and/or id ${contribution.contribution_id}`,
  );
  // Check if pending mint
  // if pending mint and not on_chain_id then compare
  // name, proof and details, and chain id
  if (contribution.on_chain_id) {
    return await govrn.contribution.upsert({
      where: {
        chain_id_on_chain_id: {
          chain_id: await getIdOfChain(contribution.chain_id),
          on_chain_id: contribution.on_chain_id,
        },
      },
      create: {
        name: contribution.name,
        proof: contribution.proof,
        details: contribution.details,
        date_of_engagement: contribution.date_of_engagement,
        user: { connect: { id: contribution.user_id } },
        activity_type: { connect: { id: contribution.activity_type_id } },
        status: {
          connect: { name: 'minted' },
        },
        on_chain_id: contribution.on_chain_id,
        chain: { connect: { chain_id: `${contribution.chain_id}` } },
        tx_hash: contribution.txHash,
      },
      update: {
        name: { set: contribution.name },
        on_chain_id: { set: contribution.on_chain_id },
        proof: { set: contribution.proof ?? null },
        details: { set: contribution.details ?? null },
        chain: { connect: { chain_id: `${contribution.chain_id}` } },
        status: { connect: { name: contribution.status_name } },
        tx_hash: { set: contribution.txHash },
      },
    });

    // something somehting
    const existingContribution = await govrn.contribution.list({
      where: {
        details: { equals: contribution.details },
        name: { equals: contribution.name },
        proof: { equals: contribution.proof },
        status: { is: { name: { equals: 'pending_mint' } } },
        user_id: { equals: contribution.user_id },
      },
    });
    if (existingContribution.result.length > 0) {
      return await govrn.contribution.update({
        data: {
          date_of_engagement: { set: contribution.date_of_engagement },
          user: { connect: { id: contribution.user_id } },
          // Change this
          activity_type: { connect: { id: contribution.activity_type_id } },
          status: {
            connect: { name: 'minted' },
          },
          on_chain_id: { set: contribution.on_chain_id },
          chain: { connect: { chain_id: `${contribution.chain_id}` } },
          tx_hash: { set: contribution.txHash },
        },
        where: {
          id: existingContribution.result[0].id,
        },
      });
    }
    return;

    // fetch by xyz
    //

    // return await govrn.contribution.update({
    //   where: {
    //     id: contribution.contribution_id,
    //   },
    //   data: {
    //     name: { set: contribution.name },
    //     on_chain_id: { set: contribution.on_chain_id },
    //     proof: { set: contribution.proof ?? null },
    //     details: { set: contribution.details ?? null },
    //     chain: { connect: { chain_id: `${contribution.chain_id}` } },
    //   },
    // });
  }
};

export const bulkCreateAttestations = async (
  attestations: {
    confidence_id: number;
    user_id: number;
    contribution_id: number;
    date_of_attestation: Date;
  }[],
) => {
  return await govrn.attestation.bulkCreate({
    data: attestations,
    skipDuplicates: true,
  });
};

export const createJobRun = async (job: {
  startDate: Date;
  completedDate: Date;
  name: string;
}) => {
  return await govrn.jobRun.create({
    data: job,
  });
};

export const getJobRun = async (args: { name: string }) => {
  return await govrn.jobRun.list({
    first: 1,
    orderBy: { completedDate: SortOrder.Desc },
    where: { name: { equals: args.name } },
  });
};
