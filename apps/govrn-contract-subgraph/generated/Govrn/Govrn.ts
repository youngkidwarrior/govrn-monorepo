// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Attest extends ethereum.Event {
  get params(): Attest__Params {
    return new Attest__Params(this);
  }
}

export class Attest__Params {
  _event: Attest;

  constructor(event: Attest) {
    this._event = event;
  }

  get attestor(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get contribution(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get confidence(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class Mint extends ethereum.Event {
  get params(): Mint__Params {
    return new Mint__Params(this);
  }
}

export class Mint__Params {
  _event: Mint;

  constructor(event: Mint) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class Govrn__attestationsResult {
  value0: BigInt;
  value1: i32;
  value2: BigInt;

  constructor(value0: BigInt, value1: i32, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set(
      "value1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value1))
    );
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getContribution(): BigInt {
    return this.value0;
  }

  getConfidence(): i32 {
    return this.value1;
  }

  getDateOfSubmission(): BigInt {
    return this.value2;
  }
}

export class Govrn__contributionsResult {
  value0: Address;
  value1: Bytes;
  value2: Bytes;
  value3: BigInt;
  value4: BigInt;
  value5: Bytes;

  constructor(
    value0: Address,
    value1: Bytes,
    value2: Bytes,
    value3: BigInt,
    value4: BigInt,
    value5: Bytes
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromBytes(this.value1));
    map.set("value2", ethereum.Value.fromBytes(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    map.set("value5", ethereum.Value.fromBytes(this.value5));
    return map;
  }

  getOwner(): Address {
    return this.value0;
  }

  getName(): Bytes {
    return this.value1;
  }

  getDetails(): Bytes {
    return this.value2;
  }

  getDateOfSubmission(): BigInt {
    return this.value3;
  }

  getDateOfEngagement(): BigInt {
    return this.value4;
  }

  getProof(): Bytes {
    return this.value5;
  }
}

export class Govrn extends ethereum.SmartContract {
  static bind(address: Address): Govrn {
    return new Govrn("Govrn", address);
  }

  DOMAIN_SEPARATOR(): Bytes {
    let result = super.call(
      "DOMAIN_SEPARATOR",
      "DOMAIN_SEPARATOR():(bytes32)",
      []
    );

    return result[0].toBytes();
  }

  try_DOMAIN_SEPARATOR(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "DOMAIN_SEPARATOR",
      "DOMAIN_SEPARATOR():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  VERSION(): string {
    let result = super.call("VERSION", "VERSION():(string)", []);

    return result[0].toString();
  }

  try_VERSION(): ethereum.CallResult<string> {
    let result = super.tryCall("VERSION", "VERSION():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  attestations(param0: BigInt, param1: Address): Govrn__attestationsResult {
    let result = super.call(
      "attestations",
      "attestations(uint256,address):(uint256,uint8,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromAddress(param1)
      ]
    );

    return new Govrn__attestationsResult(
      result[0].toBigInt(),
      result[1].toI32(),
      result[2].toBigInt()
    );
  }

  try_attestations(
    param0: BigInt,
    param1: Address
  ): ethereum.CallResult<Govrn__attestationsResult> {
    let result = super.tryCall(
      "attestations",
      "attestations(uint256,address):(uint256,uint8,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromAddress(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Govrn__attestationsResult(
        value[0].toBigInt(),
        value[1].toI32(),
        value[2].toBigInt()
      )
    );
  }

  balanceOf(param0: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  contributionCount(): BigInt {
    let result = super.call(
      "contributionCount",
      "contributionCount():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_contributionCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "contributionCount",
      "contributionCount():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  contributions(param0: BigInt): Govrn__contributionsResult {
    let result = super.call(
      "contributions",
      "contributions(uint256):(address,bytes,bytes,uint256,uint256,bytes)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new Govrn__contributionsResult(
      result[0].toAddress(),
      result[1].toBytes(),
      result[2].toBytes(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBytes()
    );
  }

  try_contributions(
    param0: BigInt
  ): ethereum.CallResult<Govrn__contributionsResult> {
    let result = super.tryCall(
      "contributions",
      "contributions(uint256):(address,bytes,bytes,uint256,uint256,bytes)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Govrn__contributionsResult(
        value[0].toAddress(),
        value[1].toBytes(),
        value[2].toBytes(),
        value[3].toBigInt(),
        value[4].toBigInt(),
        value[5].toBytes()
      )
    );
  }

  nonces(param0: Address): BigInt {
    let result = super.call("nonces", "nonces(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_nonces(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("nonces", "nonces(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  ownerOf(_tokenId: BigInt): Address {
    let result = super.call("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    ]);

    return result[0].toAddress();
  }

  try_ownerOf(_tokenId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  partners(param0: BigInt, param1: Address): boolean {
    let result = super.call("partners", "partners(uint256,address):(bool)", [
      ethereum.Value.fromUnsignedBigInt(param0),
      ethereum.Value.fromAddress(param1)
    ]);

    return result[0].toBoolean();
  }

  try_partners(param0: BigInt, param1: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("partners", "partners(uint256,address):(bool)", [
      ethereum.Value.fromUnsignedBigInt(param0),
      ethereum.Value.fromAddress(param1)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  revokeAttestatation(_contribution: BigInt): boolean {
    let result = super.call(
      "revokeAttestatation",
      "revokeAttestatation(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(_contribution)]
    );

    return result[0].toBoolean();
  }

  try_revokeAttestatation(_contribution: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "revokeAttestatation",
      "revokeAttestatation(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(_contribution)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  revokePeriod(): BigInt {
    let result = super.call("revokePeriod", "revokePeriod():(uint256)", []);

    return result[0].toBigInt();
  }

  try_revokePeriod(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("revokePeriod", "revokePeriod():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _revokePeriod(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class _attestCall extends ethereum.Call {
  get inputs(): _attestCall__Inputs {
    return new _attestCall__Inputs(this);
  }

  get outputs(): _attestCall__Outputs {
    return new _attestCall__Outputs(this);
  }
}

export class _attestCall__Inputs {
  _call: _attestCall;

  constructor(call: _attestCall) {
    this._call = call;
  }

  get _contribution(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _confidence(): i32 {
    return this._call.inputValues[1].value.toI32();
  }
}

export class _attestCall__Outputs {
  _call: _attestCall;

  constructor(call: _attestCall) {
    this._call = call;
  }
}

export class AttestCall extends ethereum.Call {
  get inputs(): AttestCall__Inputs {
    return new AttestCall__Inputs(this);
  }

  get outputs(): AttestCall__Outputs {
    return new AttestCall__Outputs(this);
  }
}

export class AttestCall__Inputs {
  _call: AttestCall;

  constructor(call: AttestCall) {
    this._call = call;
  }

  get _contribution(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _confidence(): i32 {
    return this._call.inputValues[1].value.toI32();
  }
}

export class AttestCall__Outputs {
  _call: AttestCall;

  constructor(call: AttestCall) {
    this._call = call;
  }
}

export class BulkAttestCall extends ethereum.Call {
  get inputs(): BulkAttestCall__Inputs {
    return new BulkAttestCall__Inputs(this);
  }

  get outputs(): BulkAttestCall__Outputs {
    return new BulkAttestCall__Outputs(this);
  }
}

export class BulkAttestCall__Inputs {
  _call: BulkAttestCall;

  constructor(call: BulkAttestCall) {
    this._call = call;
  }

  get _attestations(): Array<BulkAttestCall_attestationsStruct> {
    return this._call.inputValues[0].value.toTupleArray<
      BulkAttestCall_attestationsStruct
    >();
  }
}

export class BulkAttestCall__Outputs {
  _call: BulkAttestCall;

  constructor(call: BulkAttestCall) {
    this._call = call;
  }
}

export class BulkAttestCall_attestationsStruct extends ethereum.Tuple {
  get contribution(): BigInt {
    return this[0].toBigInt();
  }

  get confidence(): i32 {
    return this[1].toI32();
  }

  get dateOfSubmission(): BigInt {
    return this[2].toBigInt();
  }
}

export class BulkMintCall extends ethereum.Call {
  get inputs(): BulkMintCall__Inputs {
    return new BulkMintCall__Inputs(this);
  }

  get outputs(): BulkMintCall__Outputs {
    return new BulkMintCall__Outputs(this);
  }
}

export class BulkMintCall__Inputs {
  _call: BulkMintCall;

  constructor(call: BulkMintCall) {
    this._call = call;
  }

  get _contributions(): Array<BulkMintCall_contributionsStruct> {
    return this._call.inputValues[0].value.toTupleArray<
      BulkMintCall_contributionsStruct
    >();
  }
}

export class BulkMintCall__Outputs {
  _call: BulkMintCall;

  constructor(call: BulkMintCall) {
    this._call = call;
  }
}

export class BulkMintCall_contributionsStruct extends ethereum.Tuple {
  get contribution(): BulkMintCall_contributionsContributionStruct {
    return changetype<BulkMintCall_contributionsContributionStruct>(
      this[0].toTuple()
    );
  }

  get partners(): Array<Address> {
    return this[1].toAddressArray();
  }
}

export class BulkMintCall_contributionsContributionStruct extends ethereum.Tuple {
  get owner(): Address {
    return this[0].toAddress();
  }

  get name(): Bytes {
    return this[1].toBytes();
  }

  get details(): Bytes {
    return this[2].toBytes();
  }

  get dateOfSubmission(): BigInt {
    return this[3].toBigInt();
  }

  get dateOfEngagement(): BigInt {
    return this[4].toBigInt();
  }

  get proof(): Bytes {
    return this[5].toBytes();
  }
}

export class MintCall extends ethereum.Call {
  get inputs(): MintCall__Inputs {
    return new MintCall__Inputs(this);
  }

  get outputs(): MintCall__Outputs {
    return new MintCall__Outputs(this);
  }
}

export class MintCall__Inputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }

  get _name(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _details(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get _dateOfSubmission(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _dateOfEngagement(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _proof(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }

  get _partners(): Array<Address> {
    return this._call.inputValues[5].value.toAddressArray();
  }
}

export class MintCall__Outputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }
}

export class PermitAttestCall extends ethereum.Call {
  get inputs(): PermitAttestCall__Inputs {
    return new PermitAttestCall__Inputs(this);
  }

  get outputs(): PermitAttestCall__Outputs {
    return new PermitAttestCall__Outputs(this);
  }
}

export class PermitAttestCall__Inputs {
  _call: PermitAttestCall;

  constructor(call: PermitAttestCall) {
    this._call = call;
  }

  get _attestor(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _contribution(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _confidence(): i32 {
    return this._call.inputValues[2].value.toI32();
  }

  get _dateOfSubmission(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _deadline(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get v(): i32 {
    return this._call.inputValues[5].value.toI32();
  }

  get r(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }

  get s(): Bytes {
    return this._call.inputValues[7].value.toBytes();
  }
}

export class PermitAttestCall__Outputs {
  _call: PermitAttestCall;

  constructor(call: PermitAttestCall) {
    this._call = call;
  }
}

export class RevokeAttestatationCall extends ethereum.Call {
  get inputs(): RevokeAttestatationCall__Inputs {
    return new RevokeAttestatationCall__Inputs(this);
  }

  get outputs(): RevokeAttestatationCall__Outputs {
    return new RevokeAttestatationCall__Outputs(this);
  }
}

export class RevokeAttestatationCall__Inputs {
  _call: RevokeAttestatationCall;

  constructor(call: RevokeAttestatationCall) {
    this._call = call;
  }

  get _contribution(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class RevokeAttestatationCall__Outputs {
  _call: RevokeAttestatationCall;

  constructor(call: RevokeAttestatationCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}
