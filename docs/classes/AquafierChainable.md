[**aquafier-js-sdk**](../README.md)

***

# Class: AquafierChainable

Defined in: [index.ts:168](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L168)

## Constructors

### new AquafierChainable()

> **new AquafierChainable**(`initialValue`): [`AquafierChainable`](AquafierChainable.md)

Defined in: [index.ts:173](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L173)

#### Parameters

##### initialValue

[`AquaTree`](../interfaces/AquaTree.md)

#### Returns

[`AquafierChainable`](AquafierChainable.md)

## Methods

### getLogs()

> **getLogs**(): [`LogData`](../interfaces/LogData.md)[]

Defined in: [index.ts:269](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L269)

#### Returns

[`LogData`](../interfaces/LogData.md)[]

***

### getValue()

> **getValue**(): [`AquaTree`](../interfaces/AquaTree.md)

Defined in: [index.ts:263](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L263)

#### Returns

[`AquaTree`](../interfaces/AquaTree.md)

***

### getVerificationValue()

> **getVerificationValue**(): [`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>

Defined in: [index.ts:266](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L266)

#### Returns

[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>

***

### notarize()

> **notarize**(`fileObject`, `isForm`, `enableContent`, `enableScalar`): `Promise`\<[`AquafierChainable`](AquafierChainable.md)\>

Defined in: [index.ts:191](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L191)

#### Parameters

##### fileObject

[`FileObject`](../interfaces/FileObject.md)

##### isForm

`boolean` = `false`

##### enableContent

`boolean` = `false`

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`AquafierChainable`](AquafierChainable.md)\>

***

### sign()

> **sign**(`signType`, `credentials`, `enableScalar`): `Promise`\<[`AquafierChainable`](AquafierChainable.md)\>

Defined in: [index.ts:205](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L205)

#### Parameters

##### signType

[`SignType`](../type-aliases/SignType.md) = `"metamask"`

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md) = `...`

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`AquafierChainable`](AquafierChainable.md)\>

***

### unwrap()

> **unwrap**(`result`): [`AquaTree`](../interfaces/AquaTree.md)

Defined in: [index.ts:179](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L179)

#### Parameters

##### result

[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>

#### Returns

[`AquaTree`](../interfaces/AquaTree.md)

***

### verify()

> **verify**(`linkedFileObject`): `Promise`\<[`AquafierChainable`](AquafierChainable.md)\>

Defined in: [index.ts:252](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L252)

#### Parameters

##### linkedFileObject

[`FileObject`](../interfaces/FileObject.md)[] = `[]`

#### Returns

`Promise`\<[`AquafierChainable`](AquafierChainable.md)\>

***

### witness()

> **witness**(`witnessType`, `witnessNetwork`, `witnessPlatform`, `credentials`, `enableScalar`): `Promise`\<[`AquafierChainable`](AquafierChainable.md)\>

Defined in: [index.ts:231](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L231)

#### Parameters

##### witnessType

[`WitnessType`](../type-aliases/WitnessType.md) = `"eth"`

##### witnessNetwork

[`WitnessNetwork`](../type-aliases/WitnessNetwork.md) = `"sepolia"`

##### witnessPlatform

[`WitnessPlatformType`](../type-aliases/WitnessPlatformType.md) = `"metamask"`

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md) = `...`

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`AquafierChainable`](AquafierChainable.md)\>
