# typed-validators

[![CircleCI](https://circleci.com/gh/jcoreio/typed-validators.svg?style=svg)](https://circleci.com/gh/jcoreio/typed-validators)
[![Coverage Status](https://codecov.io/gh/jcoreio/typed-validators/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/typed-validators)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/typed-validators.svg)](https://badge.fury.io/js/typed-validators)

Complex type validators that generate TypeScript or Flow types for you.
The validation errors are detailed. Adapted from the brilliant work in `flow-runtime`.

# Table of Contents

<!-- toc -->

- [typed-validators](#typed-validators)
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Limitations](#limitations)
- [Generating validators from type defs](#generating-validators-from-type-defs)
  - [Before](#before)
  - [Command](#command)
  - [After](#after)
- [API](#api)
  - [Type creators](#type-creators)
    - [`t.any()`](#tany)
    - [`t.unknown()`](#tunknown)
    - [`t.boolean()`](#tboolean)
    - [`t.boolean(true)`](#tbooleantrue)
    - [`t.string()`](#tstring)
    - [`t.string('foo')`](#tstringfoo)
    - [`t.number()`](#tnumber)
    - [`t.number(3)`](#tnumber3)
    - [`t.symbol()`](#tsymbol)
    - [`t.symbol(MySymbol)`](#tsymbolmysymbol)
    - [`t.null()` / `t.nullLiteral()`](#tnull--tnullliteral)
    - [`t.nullOr(t.string())`](#tnullortstring)
    - [`t.undefined()` / `t.undefinedLiteral()`](#tundefined--tundefinedliteral)
    - [`t.nullish()`](#tnullish)
    - [`t.nullishOr(t.string())`](#tnullishortstring)
    - [`t.array(t.number())`](#tarraytnumber)
    - [`t.readonlyArray(t.number())`](#treadonlyarraytnumber)
    - [`t.object(properties)`](#tobjectproperties)
    - [`t.object({ required?, optional?, exact? })`](#tobject-required-optional-exact-)
    - [`t.readonly(objectType)`](#treadonlyobjecttype)
    - [`t.merge(...objectTypes)`](#tmergeobjecttypes)
    - [`t.mergeInexact(...objectTypes)`](#tmergeinexactobjecttypes)
    - [`t.record(t.string(), t.number())`](#trecordtstring-tnumber)
    - [`t.instanceOf(() => Date)`](#tinstanceof--date)
    - [`t.tuple(t.string(), t.number())`](#ttupletstring-tnumber)
    - [`t.allOf(A, B)`](#tallofa-b)
    - [`t.oneOf(t.string(), t.number())`](#toneoftstring-tnumber)
    - [`t.alias(name, type)`](#taliasname-type)
    - [`t.ref(() => typeAlias)`](#tref--typealias)
  - [`t.Type<T>`](#ttypet)
    - [`accepts(input: any): boolean`](#acceptsinput-any-boolean)
    - [`acceptsSomeCompositeTypes: boolean (getter)`](#acceptssomecompositetypes-boolean-getter)
    - [`assert<V extends T>(input: any, prefix = '', path?: (string | number | symbol)[]): V`](#assertv-extends-tinput-any-prefix---path-string--number--symbol-v)
    - [`validate(input: any, prefix = '', path?: (string | number | symbol)[]): Validation<T>`](#validateinput-any-prefix---path-string--number--symbol-validationt)
    - [`warn(input: any, prefix = '', path?: (string | number | symbol)[]): void`](#warninput-any-prefix---path-string--number--symbol-void)
    - [`toString(): string`](#tostring-string)
  - [`t.ExtractType<T extends Type<any>>`](#textracttypet-extends-typeany)
  - [`t.TypeAlias<T>`](#ttypealiast)
    - [`readonly name: string`](#readonly-name-string)
    - [`addConstraint(...constraints: TypeConstraint<T>[]): this`](#addconstraintconstraints-typeconstraintt-this)
  - [Custom Constraints](#custom-constraints)
  - [Recursive Types](#recursive-types)

<!-- tocstop -->

# Introduction

When you need to validate the inputs to a TypeScript or Flow API, a problem arises. How do you ensure that a value that passes validation
matches your declared TypeScript type? Someone might modify one and forget to modify the other:

```ts
type Post = {
  author: {
    name: string
    username: string
  }
  content: string
  // newly added by developer
  tags: string[]
}

// hypothetical syntax
const validator = requireObject({
  author: requireObject({
    name: requireString(),
    username: requireString(),
  }),
  content: requireString(),
  // uhoh!! developer forgot to add tags here
})
```

`typed-validators` solves this by generating TypeScript or Flow types from your validators:

```ts
import * as t from 'typed-validators'

const PostValidator = t.object({
  author: t.object({
    name: t.string(),
    username: t.string(),
  }),
  content: t.string(),
  tags: t.array(t.string()),
})

type Post = t.ExtractType<typeof PostValidator>

const example: Post = PostValidator.assert({
  author: {
    name: 'MC Hammer',
    username: 'hammertime',
  },
  content: "Can't touch this",
  tags: ['mc-hammer', 'hammertime'],
})
```

Hover over `Post` in VSCode and you'll see, voilà:

```ts
type Post = {
  author: {
    name: string
    username: string
  }
  content: string
  tags: string[]
}
```

Example error message:

```ts
PostValidator.assert({
  author: {
    name: 'MC Hammer',
    usernme: 'hammertime',
  },
  content: 1,
  tags: ['mc-hammer', { tag: 'hammertime' }],
})
```

```
RuntimeTypeError: input.author is missing required property username, which must be a string

Actual Value: {
  name: "MC Hammer",
  usernme: "hammertime",
}

-------------------------------------------------

input.author has unknown property: usernme

Actual Value: {
  name: "MC Hammer",
  usernme: "hammertime",
}

-------------------------------------------------

input.content must be a string

Actual Value: 1

-------------------------------------------------

input.tags[1] must be a string

Actual Value: {
  tag: "hammertime",
}
```

# Limitations

- Flow seems to suck at fully resolving `t.ExtractType<...>` for deeply nested object types. Past a certain level of complexity
  it seems to give up and use `any` for some object-valued properties. That's why I created [`gen-typed-validators`](https://github.com/jcoreio/gen-typed-validators),
  so that you can control the type definitions and generate `typed-validators` from them.
- Generic types aren't supported. I may add support for it in the future if I'm confident I can make a robust implementation.
- Function types aren't supported. You can use `t.instanceOf(() => Function)`, but Flow treats the `Function` type as `any`. I may add `t.function()` in the future, but
  it won't validate argument or return types, because those can't be determined from function instances at runtime.
- The goal is to support a subset of types common to TS and Flow well, rather than support every possible complex derived type
  you can make. (That's what `babel-plugin-flow-runtime` basically tried to do, and it was too ambitious. I created this so that I could
  stop using it.)

# Generating validators from type defs

This is now possible with [`gen-typed-validators`](https://github.com/jcoreio/gen-typed-validators)!

It creates or replaces validators anywhere you declare a variable of type `t.TypeAlias`:

### Before

```ts
// Post.ts
import * as t from 'typed-validators'

type Author = {
  name: string
  username: string
}

export type Post = {
  author: Author
  content: string
  tags: string[]
}

export const PostType: t.TypeAlias<Post> = null
```

### Command

```sh
$ gen-typed-validators Post.ts
```

### After

```ts
// Post.ts
import * as t from 'typed-validators'

export type Author = {
  name: string
  username: string
}

const AuthorType: t.TypeAlias<Author> = t.alias(
  'Author',
  t.object({
    name: t.string(),
    username: t.string(),
  })
)

export type Post = {
  author: Author
  content: string
  tags: string[]
}

export const PostType: t.TypeAlias<Post> = t.alias(
  'Post',
  t.object({
    author: t.ref(() => AuthorType),
    content: t.string(),
    tags: t.array(t.string()),
  })
)
```

# API

I recommend importing like this:

```ts
import * as t from 'typed-validators'
```

## Type creators

All of the following methods return an instance of `t.Type<T>`.

### `t.any()`

A validator that accepts any value.

### `t.unknown()`

A validator that accepts any value but has TS `unknown` type/Flow `mixed` type.

### `t.boolean()`

A validator that requires the value to be a `boolean`.

### `t.boolean(true)`

A validator that requires the value to be `true`.

Note: to get the proper Flow types, you'll unforunately have to do `t.boolean<true>(true)`.

### `t.string()`

A validator that requires the value to be a `string`.

### `t.string('foo')`

A validator that requires the value to be `'foo'`.

Note: to get the proper Flow types, you'll unfortunately have to do `t.string<'foo'>('foo')`.

### `t.number()`

A validator that requires the value to be a `number`.

### `t.number(3)`

A validator that requires the value to be `3`.

Note: to get the proper Flow types, you'll unfortunately have to do `t.number<3>(3)`.

### `t.symbol()`

A validator that requires the value to be a `symbol`.

### `t.symbol(MySymbol)`

A validator that requires the value to be `MySymbol`.

### `t.null()` / `t.nullLiteral()`

A validator that requires the value to be `null`.

### `t.nullOr(t.string())`

A validator that requires the value to be `string | null`

### `t.undefined()` / `t.undefinedLiteral()`

A validator that requires the value to be `undefined`.

### `t.nullish()`

A validator that requires the value to be `null | undefined`.

### `t.nullishOr(t.string())`

A validator that requires the value to be `string | null | undefined`.

### `t.array(t.number())`

A validator that requires the value to be `number[]`.

### `t.readonlyArray(t.number())`

A validator that requires the value to be `number[]`.
Doesn't require the value to be frozen; just allows the extracted type to be `ReadonlyArray`.

### `t.object(properties)`

A validator that requires the value to be an object with all of the given required properties an no additional properties.

For example:

```ts
const PersonType = t.object({
  name: t.string(),
  age: t.number(),
})

PersonType.assert({ name: 'dude', age: 100 }) // ok
PersonType.assert({ name: 'dude' }) // error
PersonType.assert({ name: 1, age: 100 }) // error
PersonType.assert({ name: 'dude', age: 100, powerLevel: 9000 }) // error
```

### `t.object({ required?, optional?, exact? })`

A validator that requires the value to be an object with given properties.
Additional properties won't be allowed unless `exact` is `false`.

For example:

```ts
const PersonType = t.object({
  required: {
    name: t.string(),
  },
  optional: {
    age: t.number(),
  },
})

PersonType.assert({ name: 'dude' }) // ok
PersonType.assert({ name: 'dude', age: 100 }) // ok
PersonType.assert({ name: 1 }) // error
PersonType.assert({ name: 'dude', age: 'old' }) // error
```

### `t.readonly(objectType)`

Use `t.readOnly(t.object(...))` or `t.readOnly(t.merge(...))` etc. Doesn't require the object to be frozen, just allows the extracted type to be readonly.

### `t.merge(...objectTypes)`

Merges the properties of multiple object validators together into an exact object validator (no additional properties are allowed).

Note: merging `t.alias`es and `t.ref`s that resolve to object validators is supported, but any constraints on the referenced aliases won't be applied.

For example:

```ts
const PersonType = t.object({
  required: {
    name: t.string(),
  },
  optional: {
    age: t.number(),
  },
})
const AddressType = t.object({
  street: t.string(),
  city: t.string(),
  state: t.string(),
  zip: t.string(),
})

const PersonWithAddressType = t.merge(PersonType, AddressType)

PersonWithAddressType.assert({
  // ok
  name: 'dude',
  age: 100,
  street: 'Bourbon Street',
  city: 'New Orleans',
  zip: '77777',
})
```

### `t.mergeInexact(...objectTypes)`

Merges the properties of multiple object validators together into an inexact object validator (additional properties are allowed).

Note: merging `t.alias`es and `t.ref`s that resolve to object validators is supported, but any constraints on the referenced aliases won't be applied.

Accepts a variable number of arguments, though type generation is only overloaded up to 8 arguments.
Accepts a variable number of arguments, though type generation is only overloaded up to 8 arguments.

### `t.record(t.string(), t.number())`

A validator that requires the value to be `Record<string, number>`.

### `t.instanceOf(() => Date)`

A validator that requires the value to be an instance of `Date`.

### `t.tuple(t.string(), t.number())`

A validator that requires the value to be `[string, number]`.
Accepts a variable number of arguments, though type generation for Flow is only overloaded up to 8 arguments.

### `t.allOf(A, B)`

A validator that requires the value to be `A & B`. Accepts a variable number of arguments, though type generation is only overloaded up to 8 arguments. For example:

```ts
const ThingType = t.object({ name: t.string() })
const CommentedType = t.object({ comment: t.string() })

const CommentedThingType = t.allOf(ThingType, CommentedType)

CommentedThingType.assert({ name: 'foo', comment: 'sweet' })
```

### `t.oneOf(t.string(), t.number())`

A validator that requires the value to be `string | number`. Accepts a variable number of arguments, though type generation is only overloaded up to 32 arguments.

### `t.alias(name, type)`

Creates a `TypeAlias` with the given `name` and `type`.

Type aliases serve two purposes:

- They allow you to [create recursive type validators with `t.ref()`](#recursive-types)
- You can [add custom constraints to them](#custom-constraints)

### `t.ref(() => typeAlias)`

Creates a reference to the given `TypeAlias`. See [Recursive Types](#recursive-types) for examples.

## `t.Type<T>`

The base class for all validator types.

`T` is the type of values it accepts.

### `accepts(input: any): boolean`

Returns `true` if and only if `input` is the correct type.

### `acceptsSomeCompositeTypes: boolean (getter)`

Returns `true` if the validator accepts some values that are not primitives, null or undefined.

### `assert<V extends T>(input: any, prefix = '', path?: (string | number | symbol)[]): V`

Throws an error if `input` isn't the correct type.

`prefix` will be prepended to thrown error messages.

`path` will be prepended to validation error paths. If you are validating a function parameter named `foo`,
pass `['foo']` for `path` to get clear error messages.

### `validate(input: any, prefix = '', path?: (string | number | symbol)[]): Validation<T>`

Validates `input`, returning any errors in the `Validation`.

`prefix` and `path` are the same as in `assert`.

### `warn(input: any, prefix = '', path?: (string | number | symbol)[]): void`

Logs a warning to the console if `input` isn't the correct type.

### `toString(): string`

Returns a string representation of this type (using TS type syntax in most cases).

## `t.ExtractType<T extends Type<any>>`

Gets the TypeScript type that a validator type accepts. For example:

```ts
import * as t from 'typed-validators'

const PostValidator = t.object({
  author: t.object({
    name: t.string(),
    username: t.string(),
  }),
  content: t.string(),
  tags: t.array(t.string()),
})

type Post = t.ExtractType<typeof PostValidator>
```

Hover over `Post` in the IDE and you'll see, voilà:

```ts
type Post = {
  author: {
    name: string
    username: string
  }
  content: string
  tags: string[]
}
```

## `t.TypeAlias<T>`

### `readonly name: string`

The name of the alias.

### `addConstraint(...constraints: TypeConstraint<T>[]): this`

Adds custom constraints. `TypeConstraint<T>` is a function `(value: T) => string | null | undefined` which
returns nullish if `value` is valid, or otherwise a `string` describing why `value` is invalid.

## Custom Constraints

It's nice to be able to validate that something is a `number`, but what if we want to make sure it's positive?
We can do this by creating a type alias for `number` and adding a custom constraint to it:

```ts
const PositiveNumberType = t
  .alias('PositiveNumber', t.number())
  .addConstraint((value: number) => (value > 0 ? undefined : 'must be > 0'))

PositiveNumberType.assert(-1)
```

The assertion will throw a `t.RuntimeTypeError` with the following message:

```
input must be > 0

Actual Value: -1
```

## Recursive Types

Creating validators for recursive types takes a bit of extra effort. Naively, we would want to do this:

```ts
const NodeType = t.object({
  required: {
    value: t.any(),
  },
  optional: {
    left: NodeType,
    right: NodeType,
  },
})
```

But `left: NodeTYpe` causes the error `Block-scoped variable 'NodeType' referenced before its declaration`.

To work around this, we can create a `TypeAlias` and a reference to it:

```ts
const NodeType: t.TypeAlias<{
  value: any
  left?: Node
  right?: Node
}> = t.alias(
  'Node',
  t.object({
    required: {
      value: t.any(),
    },
    optional: {
      left: t.ref(() => NodeType),
      right: t.ref(() => NodeType),
    },
  })
)

type Node = t.ExtractType<typeof NodeType>

NodeType.assert({
  value: 'foo',
  left: {
    value: 2,
    right: {
      value: 3,
    },
  },
  right: {
    value: 6,
  },
})
```

Notice how we use a thunk function in `t.ref(() => NodeType)` to avoid referencing `NodeType` before its declaration.
