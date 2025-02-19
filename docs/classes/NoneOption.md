[**aquafier-js-sdk**](../README.md)

***

# Class: NoneOption\<T\>

Defined in: [type\_guards.ts:103](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L103)

## Type Parameters

• **T**

## Constructors

### new NoneOption()

> **new NoneOption**\<`T`\>(): [`NoneOption`](NoneOption.md)\<`T`\>

#### Returns

[`NoneOption`](NoneOption.md)\<`T`\>

## Properties

### tag

> `readonly` **tag**: `"none"` = `'none'`

Defined in: [type\_guards.ts:104](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L104)

## Methods

### isNone()

> **isNone**(): `this is NoneOption<T>`

Defined in: [type\_guards.ts:110](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L110)

#### Returns

`this is NoneOption<T>`

***

### isSome()

> **isSome**(): `this is SomeOption<T>`

Defined in: [type\_guards.ts:106](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L106)

#### Returns

`this is SomeOption<T>`

***

### map()

> **map**\<`U`\>(`_fn`): [`Option`](../type-aliases/Option.md)\<`U`\>

Defined in: [type\_guards.ts:115](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L115)

#### Type Parameters

• **U**

#### Parameters

##### \_fn

(`value`) => `U`

#### Returns

[`Option`](../type-aliases/Option.md)\<`U`\>

***

### unwrap()

> **unwrap**(): `never`

Defined in: [type\_guards.ts:119](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L119)

#### Returns

`never`

***

### unwrapOr()

> **unwrapOr**(`defaultValue`): `T`

Defined in: [type\_guards.ts:123](https://github.com/inblockio/aqua-verifier-js-lib/blob/8585c670e387bba02324c5d1649cefbfbcc39ce3/src/type_guards.ts#L123)

#### Parameters

##### defaultValue

`T`

#### Returns

`T`
