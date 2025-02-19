[**aquafier-js-sdk**](../README.md)

***

# Interface: CredentialsData

Defined in: [types.ts:27](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/types.ts#L27)

## Description

The data required for the credentials of the user

## Example

```ts
{ mnemonic: "abandon, abandon, abandon, abandon, abandon, abandon, abandon, abandon, abandon, abandon, abandon, about",
 * nostr_sk: "0x
 * did:key: "did:key:z6Mkq
 * alchemy_key: "0x
 * witness_eth_network: "sepolia"
 * witness_eth_platform: "cli"
 * }
```

## Properties

### alchemy\_key

> **alchemy\_key**: `string`

Defined in: [types.ts:31](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/types.ts#L31)

The Alchemy key of the user

***

### did:key

> **did:key**: `string`

Defined in: [types.ts:30](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/types.ts#L30)

The DID key of the user

***

### mnemonic

> **mnemonic**: `string`

Defined in: [types.ts:28](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/types.ts#L28)

The mnemonic of the user

***

### nostr\_sk

> **nostr\_sk**: `string`

Defined in: [types.ts:29](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/types.ts#L29)

The secret key of the Nostr account

***

### witness\_eth\_network

> **witness\_eth\_network**: `string`

Defined in: [types.ts:32](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/types.ts#L32)

The Ethereum network of the witness

***

### witness\_eth\_platform

> **witness\_eth\_platform**: `string`

Defined in: [types.ts:33](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/types.ts#L33)

The Ethereum platform of the witness
