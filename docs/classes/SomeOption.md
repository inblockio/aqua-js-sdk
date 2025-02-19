[**aquafier-js-sdk**](../README.md)

***

# Class: SomeOption\<T\>

Defined in: [type\_guards.ts:77](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L77)

## Type Parameters

• **T**

## Constructors

### new SomeOption()

> **new SomeOption**\<`T`\>(`value`): [`SomeOption`](SomeOption.md)\<`T`\>

Defined in: [type\_guards.ts:79](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L79)

#### Parameters

##### value

`T`

#### Returns

[`SomeOption`](SomeOption.md)\<`T`\>

## Properties

### tag

> `readonly` **tag**: `"some"` = `'some'`

Defined in: [type\_guards.ts:78](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L78)

***

### value

> `readonly` **value**: `T`

Defined in: [type\_guards.ts:79](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L79)

## Methods

### isNone()

> **isNone**(): `this is NoneOption<T>`

Defined in: [type\_guards.ts:85](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L85)

#### Returns

`this is NoneOption<T>`

***

### isSome()

> **isSome**(): `this is SomeOption<T>`

Defined in: [type\_guards.ts:81](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L81)

#### Returns

`this is SomeOption<T>`

***

### map()

> **map**\<`U`\>(`fn`): [`Option`](../type-aliases/Option.md)\<`U`\>

Defined in: [type\_guards.ts:90](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L90)

#### Type Parameters

• **U**

#### Parameters

##### fn

(`value`) => `U`

#### Returns

[`Option`](../type-aliases/Option.md)\<`U`\>

***

### unwrap()

> **unwrap**(): `T`

Defined in: [type\_guards.ts:94](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L94)

#### Returns

`T`

***

### unwrapOr()

> **unwrapOr**(`_default`): `T`

Defined in: [type\_guards.ts:98](https://github.com/inblockio/aqua-verifier-js-lib/blob/09413c69301a51b584d51846ffabc4d8f820b4fa/src/type_guards.ts#L98)

#### Parameters

##### \_default

`T`

#### Returns

`T`
