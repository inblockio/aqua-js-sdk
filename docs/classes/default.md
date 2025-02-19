[**aquafier-js-sdk**](../README.md)

***

# Class: default

Defined in: [index.ts:43](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L43)

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

Defined in: [index.ts:238](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L238)

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

Defined in: [index.ts:65](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L65)

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

Defined in: [index.ts:206](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L206)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua tree to create the form revision for

##### fileObject

[`FileObject`](../interfaces/FileObject.md)

The file object to create the form revision for

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, Log[]>

#### Method

createFormRevision

#### Description

This method creates a form revision for the aqua tree

***

### createGenesisRevision()

> **createGenesisRevision**(`fileObject`, `isForm`, `enableContent`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:79](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L79)

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

Defined in: [index.ts:234](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L234)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

#### Returns

`string`[]

***

### getFileByHash()

> **getFileByHash**(`aquaTree`, `hash`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`string`, [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:254](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L254)

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

Defined in: [index.ts:249](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L249)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

#### Returns

[`Result`](../type-aliases/Result.md)\<[`Revision`](../interfaces/Revision.md), [`LogData`](../interfaces/LogData.md)[]\>

***

### getRevisionByHash()

> **getRevisionByHash**(`aquaTree`, `hash`): [`Result`](../type-aliases/Result.md)\<[`Revision`](../interfaces/Revision.md), [`LogData`](../interfaces/LogData.md)[]\>

Defined in: [index.ts:244](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L244)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

##### hash

`string`

#### Returns

[`Result`](../type-aliases/Result.md)\<[`Revision`](../interfaces/Revision.md), [`LogData`](../interfaces/LogData.md)[]\>

***

### getVersionFromPackageJson()

> **getVersionFromPackageJson**(): `string`

Defined in: [index.ts:258](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L258)

#### Returns

`string`

***

### hideFormElements()

> **hideFormElements**(`aquaTree`, `keyToHide`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:217](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L217)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua tree to hide form elements

##### keyToHide

`string`

The key to hide

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

hideFormElements

#### Description

This method hides form elements

***

### linkAquaTree()

> **linkAquaTree**(`aquaTreeWrapper`, `linkAquaTreeWrapper`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:170](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L170)

#### Parameters

##### aquaTreeWrapper

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua tree to link

##### linkAquaTreeWrapper

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua tree to link to

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

linkAquaTree

#### Description

This method links an aqua tree to another aqua tree

***

### linkAquaTreesToMultipleAquaTrees()

> **linkAquaTreesToMultipleAquaTrees**(`aquaTreeWrappers`, `linkAquaTreeWrapper`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:194](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L194)

#### Parameters

##### aquaTreeWrappers

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua trees to link

##### linkAquaTreeWrapper

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)[]

The aqua trees to link to

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

linkAquaTreesToMultipleAquaTrees

#### Description

This method links multiple aqua trees to multiple aqua trees

***

### linkMultipleAquaTrees()

> **linkMultipleAquaTrees**(`aquaTreeWrappers`, `linkAquaTreeWrapper`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:182](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L182)

#### Parameters

##### aquaTreeWrappers

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)[]

The aqua trees to link

##### linkAquaTreeWrapper

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua tree to link to

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

linkMultipleAquaTrees

#### Description

This method links multiple aqua trees to another aqua tree

***

### removeLastRevision()

> **removeLastRevision**(`aquaTree`): [`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>

Defined in: [index.ts:53](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L53)

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

Defined in: [index.ts:146](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L146)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua tree to sign

##### signType

[`SignType`](../type-aliases/SignType.md)

The sign type to use

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md)

The credentials to use

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

signAquaTree

#### Description

This method signs the aqua tree

***

### signMultipleAquaTrees()

> **signMultipleAquaTrees**(`aquaTrees`, `signType`, `credentials`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:158](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L158)

#### Parameters

##### aquaTrees

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)[]

The aqua trees to sign

##### signType

[`SignType`](../type-aliases/SignType.md)

The sign type to use

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md)

The credentials to use

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

signMultipleAquaTrees

#### Description

This method signs multiple aqua trees

***

### unHideFormElements()

> **unHideFormElements**(`aquaTree`, `keyToUnHide`, `content`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:229](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L229)

#### Parameters

##### aquaTree

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)

The aqua tree to unhide form elements

##### keyToUnHide

`string`

The key to unhide

##### content

`string`

The content to unhide

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, Log[]>

#### Method

unHideFormElements

#### Description

This method unhides form elements

***

### verifyAquaTree()

> **verifyAquaTree**(`aquaTree`, `fileObject`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:90](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L90)

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

Defined in: [index.ts:103](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L103)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

The aqua tree to verify

##### revision

[`Revision`](../interfaces/Revision.md)

The revision to verify

##### revisionItemHash

`string`

The revision item hash to verify

##### fileObject

[`FileObject`](../interfaces/FileObject.md)[]

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

verifyAquaTreeRevision

#### Description

This method verifies the aqua tree revision

***

### witnessAquaTree()

> **witnessAquaTree**(`aquaTree`, `witnessType`, `witnessNetwork`, `witnessPlatform`, `credentials`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:118](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L118)

#### Parameters

##### aquaTree

[`AquaTree`](../interfaces/AquaTree.md)

The aqua tree to witness

##### witnessType

[`WitnessType`](../type-aliases/WitnessType.md)

The witness type to use

##### witnessNetwork

[`WitnessNetwork`](../type-aliases/WitnessNetwork.md)

The witness network to use

##### witnessPlatform

[`WitnessPlatformType`](../type-aliases/WitnessPlatformType.md)

The witness platform to use

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md)

The credentials to use

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

witnessAquaTree

#### Description

This method witnesses the aqua tree

***

### witnessMultipleAquaTrees()

> **witnessMultipleAquaTrees**(`aquaTrees`, `witnessType`, `witnessNetwork`, `witnessPlatform`, `credentials`, `enableScalar`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Defined in: [index.ts:133](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/index.ts#L133)

#### Parameters

##### aquaTrees

[`AquaTreeWrapper`](../interfaces/AquaTreeWrapper.md)[]

The aqua trees to witness

##### witnessType

[`WitnessType`](../type-aliases/WitnessType.md)

The witness type to use

##### witnessNetwork

[`WitnessNetwork`](../type-aliases/WitnessNetwork.md)

The witness network to use

##### witnessPlatform

[`WitnessPlatformType`](../type-aliases/WitnessPlatformType.md)

The witness platform to use

##### credentials

[`CredentialsData`](../interfaces/CredentialsData.md)

The credentials to use

##### enableScalar

`boolean` = `false`

A boolean value to enable scalar

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`AquaOperationData`](../interfaces/AquaOperationData.md), [`LogData`](../interfaces/LogData.md)[]\>\>

Result<AquaOperationData, LogData[]>

#### Method

witnessMultipleAquaTrees

#### Description

This method witnesses multiple aqua trees
