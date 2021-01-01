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

- [Introduction](#introduction)
- [What about generating validators from type defs?](#what-about-generating-validators-from-type-defs)
- [API](#api)
  - [Type creators](#type-creators)
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
    - [`t.object(properties)`](#tobjectproperties)
    - [`t.object({ required?, optional?, exact? })`](#tobject-required-optional-exact-)
    - [`t.record(t.string(), t.number())`](#trecordtstring-tnumber)
    - [`t.instanceOf(Date)`](#tinstanceofdate)
    - [`t.tuple(t.string(), t.number())`](#ttupletstring-tnumber)
    - [`t.allOf(A, B)`](#tallofa-b)
    - [`t.oneOf(t.string(), t.number())`](#toneoftstring-tnumber)
    - [`t.alias(name, type)`](#taliasname-type)
    - [`t.ref(() => typeAlias)`](#tref--typealias)
  - [`t.Type`](#ttype)
    - [`accepts(input: any): boolean`](#acceptsinput-any-boolean)
    - [`assert(input: any, prefix = '', path?: (string | number | symbol)[]): V`](#assertinput-any-prefix---path-string--number--symbol-v)
    - [`validate(input: any, prefix = '', path?: (string | number | symbol)[]): Validation`](#validateinput-any-prefix---path-string--number--symbol-validation)
    - [`warn(input: any, prefix = '', path?: (string | number | symbol)[]): void`](#warninput-any-prefix---path-string--number--symbol-void)
    - [`toString(): string`](#tostring-string)
  - [`t.ExtractType>`](#textracttype)
  - [`t.TypeAlias`](#ttypealias)
    - [`readonly name: string`](#readonly-name-string)
    - [`addConstraint(...constraints: TypeConstraint[]): this`](#addconstraintconstraints-typeconstraint-this)
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

# What about generating validators from type defs?

I'd like to be able to do this, because type defs are a lot more readable. In fact, for Flow, it's possible with
`babel-pluging-flow-runtime`, which I have a lot of experience with. That looks like this:

```js
import {type Type, reify} from 'flow-runtime'

type Post = {
  author: {
    name: string
    username: string
  }
  content: string
  tags: string[]
}

const PostValidator = (reify: Type<Post>) // looooots of magic here

const example: Post = PostValidator.assert({
  author: {
    name: 'MC Hammer',
    username: 'hammertime',
  },
  content: "Can't touch this",
  tags: ['mc-hammer', 'hammertime'],
})
```

This is sweet but there are some caveats:

- You have to add a Babel plugin to your toolchain (for TypeScript, not everyone wants to use Babel)
- There are issues with the Babel plugin. It aims to support all Flow types, with varying success.
- The original author of `flow-runtime` abandoned the project and I don't blame him. It was hugely ambitious and difficult to maintain.

The author of `flow-runtime` himself told me in private conversations that he had moved on to an approach like
`typed-validators` in his own projects, because generating types from the validator declarations is a lot
simpler and more maintainable in the long run.

# API

I recommend importing like this:

```ts
import * as t from 'typed-validators'
```

## Type creators

All of the following methods return an instance of `t.Type<T>`.

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

### `t.record(t.string(), t.number())`

A validator that requires the value to be `Record<string, number>`.

### `t.instanceOf(Date)`

A validator that requires the value to be an instance of `Date`.

### `t.tuple(t.string(), t.number())`

A validator that requires the value to be `[string, number]`.
Accepts a variable number of arguments.

### `t.allOf(A, B)`

A validator that requires the value to be `A & B`. Accepts a variable number of arguments, though type generation is only overloaded up to 8 arguments. For example:

```ts
const ThingType = t.object({ name: t.string() })
const CommentedType = t.object({ comment: t.string() })

const CommentedThingType = t.allOf(ThingType, CommentedType)

CommentedThingType.assert({ name: 'foo', comment: 'sweet' })
```

### `t.oneOf(t.string(), t.number())`

A validator that requires the value to be `string | number`. Accepts a variable number of arguments, though type generation is only overloaded up to 8 arguments.

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
Value must be > 0

Expected: PositiveNumber

Actual Value: -1

Actual Type: number
```

## Recursive Types

Creating validators for recursive types takes a bit of extra effort. Naively, we would want to do this:

```ts
const NodeType = t.object<{
  value: any
  left?: any
  right?: any
}>()({
  value: t.any(),
  left: t.optional(NodeType),
  right: t.optional(NodeType),
})
```

But `t.optional(NodeType)` causes the error `Block-scoped variable 'NodeType' referenced before its declaration`.

To work around this, we can create a `TypeAlias` and a reference to it:

```ts
const NodeType: t.TypeAlias<{
  value: any
  left?: Node
  right?: Node
}> = t.alias(
  'Node',
  t.object<{
    value: any
    left?: any
    right?: any
  }>()({
    value: t.any(),
    left: t.optional(t.ref(() => NodeType)),
    right: t.optional(t.ref(() => NodeType)),
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
