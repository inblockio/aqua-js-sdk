[**aquafier-js-sdk**](../README.md)

***

# Class: default

Defined in: [index.ts:43](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L43)

Aquafier

## Description

This class is the main class that contains all the methods that can be used to interact with the aqua tree data structure

## Method

removeLastRevision

## Method

createContentRevision

## Method

createGenesisRevision

## Method

verifyAquaTree

## Method

verifyAquaTreeRevision

## Method

witnessAquaTree

## Method

witnessMultipleAquaTrees

## Method

signAquaTree

## Method

signMultipleAquaTrees

## Method

linkAquaTree

## Method

linkMultipleAquaTrees

## Method

linkAquaTreesToMultipleAquaTrees

## Method

createFormRevision

## Method

hideFormElements

## Method

unHideFormElements

## Method

fetchFilesToBeRead

## Method

checkIfFileAlreadyNotarized

## Method

getRevisionByHash

## Method

getLastRevision

## Method

getFileByHash

## Constructors

### new default()

> **new default**(): [`default`](default.md)

#### Returns

[`default`](default.md)

## Methods

### checkIfFileAlreadyNotarized()

> **checkIfFileAlreadyNotarized**(`aquaTree`, `fileObject`): `boolean`

Defined in: [index.ts:145](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L145)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

##### fileObject

[`FileObject`](../interfaces/FileObject.md)

#### Returns

`boolean`

***

### createContentRevision()

> **createContentRevision**(`aquaTree`, `fileObject`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:65](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L65)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua tree to create the content revision for

##### fileObject

[`FileObject`](../interfaces/FileObject.md)

The file object to create the content revision for

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

createContentRevision

#### Description

This method creates a content revision for the aqua tree

***

### createFormRevision()

> **createFormRevision**(`aquaTree`, `fileObject`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:127](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L127)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

##### fileObject

[`FileObject`](../interfaces/FileObject.md)

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### createGenesisRevision()

> **createGenesisRevision**(`fileObject`, `isForm`, `enableContent`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:79](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L79)

#### Parameters

##### fileObject

[`FileObject`](../interfaces/FileObject.md)

The file object to create the genesis revision for

##### isForm

`boolean` = `false`

A boolean value to check if the file object is a form

##### enableContent

`boolean` = `false`

A boolean value to enable content

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

createGenesisRevision

#### Description

This method creates a genesis revision for the aqua tree

***

### fetchFilesToBeRead()

> **fetchFilesToBeRead**(`aquaTree`): `string`[]

Defined in: [index.ts:141](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L141)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

#### Returns

`string`[]

***

### getFileByHash()

> **getFileByHash**(`aquaTree`, `hash`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`string`, [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:161](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L161)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

##### hash

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`string`, [`LogData`](../interfaces/LogData.md)[]\>\>

***

### getLastRevision()

> **getLastRevision**(`aquaTree`): [`Result`](../type-aliases/Result.md)\<[`Revision`](../interfaces/Revision.md), [`LogData`](../interfaces/LogData.md)[]\>

Defined in: [index.ts:156](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L156)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

#### Returns

[`Result`](../type-aliases/Result.md)\<[`Revision`](../interfaces/Revision.md), [`LogData`](../interfaces/LogData.md)[]\>

***

### getRevisionByHash()

> **getRevisionByHash**(`aquaTree`, `hash`): [`Result`](../type-aliases/Result.md)\<[`Revision`](../interfaces/Revision.md), [`LogData`](../interfaces/LogData.md)[]\>

Defined in: [index.ts:151](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L151)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

##### hash

`string`

#### Returns

[`Result`](../type-aliases/Result.md)\<[`Revision`](../interfaces/Revision.md), [`LogData`](../interfaces/LogData.md)[]\>

***

### hideFormElements()

> **hideFormElements**(`aquaTree`, `keyToHide`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:132](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L132)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

##### keyToHide

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### linkAquaTree()

> **linkAquaTree**(`aquaTreeWrapper`, `linkAquaTreeWrapper`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:115](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L115)

#### Parameters

##### aquaTreeWrapper

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

##### linkAquaTreeWrapper

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### linkAquaTreesToMultipleAquaTrees()

> **linkAquaTreesToMultipleAquaTrees**(`aquaTreeWrappers`, `linkAquaTreeWrapper`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:123](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L123)

#### Parameters

##### aquaTreeWrappers

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

##### linkAquaTreeWrapper

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)[]

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### linkMultipleAquaTrees()

> **linkMultipleAquaTrees**(`aquaTreeWrappers`, `linkAquaTreeWrapper`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:119](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L119)

#### Parameters

##### aquaTreeWrappers

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)[]

##### linkAquaTreeWrapper

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### removeLastRevision()

> **removeLastRevision**(`aquaTree`): [`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>

Defined in: [index.ts:53](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L53)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

The aqua tree to remove the last revision from

#### Returns

[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>

Result<AquaOperationData, LogData[]>

#### Method

removeLastRevision

#### Description

This method removes the last revision from the aqua tree

***

### signAquaTree()

> **signAquaTree**(`aquaTree`, `signType`, `credentials`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:106](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L106)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

##### signType

[`SignType`](../type-aliases/SignType.md)

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md)

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### signMultipleAquaTrees()

> **signMultipleAquaTrees**(`aquaTrees`, `signType`, `credentials`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:110](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L110)

#### Parameters

##### aquaTrees

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)[]

##### signType

[`SignType`](../type-aliases/SignType.md)

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### unHideFormElements()

> **unHideFormElements**(`aquaTree`, `keyToUnHide`, `content`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:136](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L136)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

##### keyToUnHide

`string`

##### content

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### verifyAquaTree()

> **verifyAquaTree**(`aquaTree`, `fileObject`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:90](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L90)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

The aqua tree to verify

##### fileObject

[`FileObject`](../interfaces/FileObject.md)[]

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

verifyAquaTree

#### Description

This method verifies the aqua tree

***

### verifyAquaTreeRevision()

> **verifyAquaTreeRevision**(`aquaTree`, `revision`, `revisionItemHash`, `fileObject`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:94](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L94)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

##### revision

[`Revision`](../interfaces/Revision.md)

##### revisionItemHash

`string`

##### fileObject

[`FileObject`](../interfaces/FileObject.md)[]

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### witnessAquaTree()

> **witnessAquaTree**(`aquaTree`, `witnessType`, `witnessNetwork`, `witnessPlatform`, `credentials`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:98](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L98)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

##### witnessType

[`WitnessType`](../type-aliases/WitnessType.md)

##### witnessNetwork

[`WitnessNetwork`](../type-aliases/WitnessNetwork.md)

##### witnessPlatform

[`WitnessPlatformType`](../type-aliases/WitnessPlatformType.md)

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md)

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

***

### witnessMultipleAquaTrees()

> **witnessMultipleAquaTrees**(`aquaTrees`, `witnessType`, `witnessNetwork`, `witnessPlatform`, `credentials`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:102](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/index.ts#L102)

#### Parameters

##### aquaTrees

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)[]

##### witnessType

[`WitnessType`](../type-aliases/WitnessType.md)

##### witnessNetwork

[`WitnessNetwork`](../type-aliases/WitnessNetwork.md)

##### witnessPlatform

[`WitnessPlatformType`](../type-aliases/WitnessPlatformType.md)

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md)

##### enableScalar

`boolean` = `false`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>
