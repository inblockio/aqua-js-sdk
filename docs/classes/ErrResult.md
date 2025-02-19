[**aquafier-js-sdk**](../README.md)

***

# Class: ErrResult\<T, E\>

Defined in: [type\_guards.ts:30](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L30)

## Type Parameters

• **T**

• **E**

## Constructors

### new ErrResult()

> **new ErrResult**\<`T`, `E`\>(`data`): [`ErrResult`](ErrResult.md)\<`T`, `E`\>

Defined in: [type\_guards.ts:32](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L32)

#### Parameters

##### data

`E`

#### Returns

[`ErrResult`](ErrResult.md)\<`T`, `E`\>

## Properties

### data

> `readonly` **data**: `E`

Defined in: [type\_guards.ts:32](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L32)

***

### tag

> `readonly` **tag**: `"err"` = `'err'`

Defined in: [type\_guards.ts:31](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L31)

## Methods

### isErr()

> **isErr**(): `this is ErrResult<T, E>`

Defined in: [type\_guards.ts:38](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L38)

#### Returns

`this is ErrResult<T, E>`

***

### isOk()

> **isOk**(): `this is OkResult<T, E>`

Defined in: [type\_guards.ts:34](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L34)

#### Returns

`this is OkResult<T, E>`

***

### map()

> **map**\<`U`\>(`_fn`): [`Result`](../type-aliases/Result.md)\<`U`, `E`\>

Defined in: [type\_guards.ts:43](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L43)

#### Type Parameters

• **U**

#### Parameters

##### \_fn

(`value`) => `U`

#### Returns

[`Result`](../type-aliases/Result.md)\<`U`, `E`\>

***

### unwrap()

> **unwrap**(): `never`

Defined in: [type\_guards.ts:47](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L47)

#### Returns

`never`

***

### unwrapOr()

> **unwrapOr**(`defaultValue`): `T`

Defined in: [type\_guards.ts:51](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L51)

#### Parameters

##### defaultValue

`T`

#### Returns

`T`
