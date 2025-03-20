[**aquafier-js-sdk**](../README.md)

***

# Class: OkResult\<T, E\>

Defined in: [type\_guards.ts:4](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L4)

## Type Parameters

• **T**

• **E**

## Constructors

### new OkResult()

> **new OkResult**\<`T`, `E`\>(`data`): [`OkResult`](OkResult.md)\<`T`, `E`\>

Defined in: [type\_guards.ts:6](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L6)

#### Parameters

##### data

`T`

#### Returns

[`OkResult`](OkResult.md)\<`T`, `E`\>

## Properties

### data

> `readonly` **data**: `T`

Defined in: [type\_guards.ts:6](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L6)

***

### tag

> `readonly` **tag**: `"ok"` = `'ok'`

Defined in: [type\_guards.ts:5](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L5)

## Methods

### isErr()

> **isErr**(): `this is ErrResult<T, E>`

Defined in: [type\_guards.ts:12](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L12)

#### Returns

`this is ErrResult<T, E>`

***

### isOk()

> **isOk**(): `this is OkResult<T, E>`

Defined in: [type\_guards.ts:8](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L8)

#### Returns

`this is OkResult<T, E>`

***

### map()

> **map**\<`U`\>(`fn`): [`Result`](../type-aliases/Result.md)\<`U`, `E`\>

Defined in: [type\_guards.ts:17](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L17)

#### Type Parameters

• **U**

#### Parameters

##### fn

(`value`) => `U`

#### Returns

[`Result`](../type-aliases/Result.md)\<`U`, `E`\>

***

### unwrap()

> **unwrap**(): `T`

Defined in: [type\_guards.ts:21](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L21)

#### Returns

`T`

***

### unwrapOr()

> **unwrapOr**(`_default`): `T`

Defined in: [type\_guards.ts:25](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L25)

#### Parameters

##### \_default

`T`

#### Returns

`T`
