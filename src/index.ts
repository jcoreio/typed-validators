import Type from './types/Type'
import AnyType from './types/AnyType'
import ArrayType from './types/ArrayType'
import BooleanLiteralType from './types/BooleanLiteralType'
import BooleanType from './types/BooleanType'
import InstanceOfType from './types/InstanceOfType'
import IntersectionType from './types/IntersectionType'
import NullLiteralType from './types/NullLiteralType'
import UndefinedLiteralType from './types/UndefinedLiteralType'
import NumberType from './types/NumberType'
import NumericLiteralType from './types/NumericLiteralType'
import ObjectType from './types/ObjectType'
import ObjectTypeProperty from './types/ObjectTypeProperty'
import RecordType from './types/RecordType'
import StringLiteralType from './types/StringLiteralType'
import StringType from './types/StringType'
import SymbolLiteralType from './types/SymbolLiteralType'
import SymbolType from './types/SymbolType'
import TupleType from './types/TupleType'
import UnionType from './types/UnionType'
import TypeAlias from './types/TypeAlias'
import TypeReference from './types/TypeReference'
import Validation from './Validation'
import RuntimeTypeError from './errorReporting/RuntimeTypeError'
import oneOf from './oneOf'
import merge from './merge'
import mergeInexact from './mergeInexact'

export {
  Type,
  AnyType,
  ArrayType,
  BooleanLiteralType,
  BooleanType,
  InstanceOfType,
  IntersectionType,
  NullLiteralType,
  UndefinedLiteralType,
  NumberType,
  NumericLiteralType,
  ObjectType,
  ObjectTypeProperty,
  RecordType,
  StringLiteralType,
  StringType,
  SymbolLiteralType,
  SymbolType,
  TupleType,
  UnionType,
  TypeAlias,
  TypeReference,
  Validation,
  RuntimeTypeError,
  oneOf,
  merge,
  mergeInexact,
}

export const any = (): Type<any> => new AnyType()
export const unknown = (): Type<unknown> => new AnyType()

export const array = <T>(elementType: Type<T>): Type<T[]> =>
  new ArrayType(elementType)

export const nullLiteral = (): Type<null> => new NullLiteralType()
export { nullLiteral as null }
export const nullOr = <T>(type: Type<T>): Type<T | null> =>
  oneOf(type, nullLiteral())

export const undefinedLiteral = (): Type<undefined> =>
  new UndefinedLiteralType()
export { undefinedLiteral as undefined }

export const nullish = <T>(type: Type<T>): Type<T | null | undefined> =>
  oneOf(type, nullLiteral(), undefinedLiteral())
export const nullishOr = <T>(type: Type<T>): Type<T | null | undefined> =>
  oneOf(type, nullLiteral(), undefinedLiteral())

export function boolean(): Type<boolean>
export function boolean<T extends true | false>(literal: T): Type<T>
export function boolean(
  literal?: boolean
): Type<boolean> | Type<true> | Type<false> {
  return literal != null ? new BooleanLiteralType(literal) : new BooleanType()
}

export function number(): Type<number>
export function number<T extends number>(literal: T): Type<T>
export function number(
  literal?: number
): Type<number> | Type<true> | Type<false> {
  return literal != null ? new NumericLiteralType(literal) : new NumberType()
}

export function string(): Type<string>
export function string<T extends string>(literal: T): Type<T>
export function string(
  literal?: string
): Type<string> | Type<true> | Type<false> {
  return literal != null ? new StringLiteralType(literal) : new StringType()
}

export function symbol(): Type<symbol>
export function symbol<T extends symbol>(literal: T): Type<T>
export function symbol(
  literal?: symbol
): Type<symbol> | Type<true> | Type<false> {
  return literal != null ? new SymbolLiteralType(literal) : new SymbolType()
}

export function object<R extends Record<string | number | symbol, Type<any>>>(
  required: R
): ObjectType<{ [K in keyof R]: ExtractType<R[K]> }>
export function object<R extends Record<string | number | symbol, Type<any>>>({
  required,
  exact,
}: {
  required: R
  exact?: boolean
}): ObjectType<{ [K in keyof R]: ExtractType<R[K]> }>
export function object<S extends Record<string | number | symbol, Type<any>>>({
  optional,
  exact,
}: {
  optional: S
  exact?: boolean
}): ObjectType<{ [K in keyof S]?: ExtractType<S[K]> }>
export function object<
  R extends Record<string | number | symbol, Type<any>>,
  S extends Record<string | number | symbol, Type<any>>
>({
  required,
  optional,
  exact,
}: {
  required: R
  optional: S
  exact?: boolean
}): ObjectType<
  { [K in keyof R]: ExtractType<R[K]> } & { [K in keyof S]?: ExtractType<S[K]> }
>
export function object<
  R extends Record<string | number | symbol, Type<any>>,
  S extends Record<string | number | symbol, Type<any>>
>(
  options:
    | R
    | {
        required?: R
        optional?: S
        exact?: boolean
      }
): ObjectType<
  { [K in keyof R]: ExtractType<R[K]> } & { [K in keyof S]?: ExtractType<S[K]> }
> {
  const { required, optional, exact } = options
  if (
    (typeof required === 'object' && !(required instanceof Type)) ||
    (typeof optional === 'object' && !(optional instanceof Type))
  ) {
    return new ObjectType(
      [
        ...[...Object.entries(required || {})].map(
          ([key, type]) => new ObjectTypeProperty(key, type, false)
        ),
        ...[...Object.entries(optional || {})].map(
          ([key, type]) => new ObjectTypeProperty(key, type, true)
        ),
      ],
      exact !== false
    ) as any
  }
  return new ObjectType(
    [...Object.entries(options)].map(
      ([key, type]) => new ObjectTypeProperty(key, type, false)
    ),
    true
  ) as any
}

export const record = <K extends string | number | symbol, V>(
  key: Type<K>,
  value: Type<V>
): RecordType<K, V> => new RecordType(key, value)

export const instanceOf = <T>(
  classType: () => {
    new (...args: any[]): T
  }
): Type<T> => new InstanceOfType(classType)

export const tuple = <T extends Type<any>[]>(
  ...types: T
): Type<{ [Index in keyof T]: T[Index] extends Type<infer E> ? E : never }> =>
  new TupleType(types) as any

export function allOf<T1>(...types: [Type<T1>]): Type<T1>
export function allOf<T1, T2>(...types: [Type<T1>, Type<T2>]): Type<T1 & T2>
export function allOf<T1, T2, T3>(
  ...types: [Type<T1>, Type<T2>, Type<T3>]
): Type<T1 & T2 & T3>
export function allOf<T1, T2, T3, T4>(
  ...types: [Type<T1>, Type<T2>, Type<T3>, Type<T4>]
): Type<T1 & T2 & T3 & T4>
export function allOf<T1, T2, T3, T4, T5>(
  ...types: [Type<T1>, Type<T2>, Type<T3>, Type<T4>, Type<T5>]
): Type<T1 & T2 & T3 & T4 & T5>
export function allOf<T1, T2, T3, T4, T5, T6>(
  ...types: [Type<T1>, Type<T2>, Type<T3>, Type<T4>, Type<T5>, Type<T6>]
): Type<T1 & T2 & T3 & T4 & T5 & T6>
export function allOf<T1, T2, T3, T4, T5, T6, T7>(
  ...types: [
    Type<T1>,
    Type<T2>,
    Type<T3>,
    Type<T4>,
    Type<T5>,
    Type<T6>,
    Type<T7>
  ]
): Type<T1 & T2 & T3 & T4 & T5 & T6 & T7>
export function allOf<T1, T2, T3, T4, T5, T6, T7, T8>(
  ...types: [
    Type<T1>,
    Type<T2>,
    Type<T3>,
    Type<T4>,
    Type<T5>,
    Type<T6>,
    Type<T7>,
    Type<T8>
  ]
): Type<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>
export function allOf(...types: Type<any>[]): Type<any> {
  return new IntersectionType(types)
}

export const alias = <T>(name: string, type: Type<T>): TypeAlias<T> =>
  new TypeAlias(name, type)

export const ref = <T>(type: () => TypeAlias<T>): Type<T> =>
  new TypeReference(type)

export type ExtractType<T extends Type<any>> = T['__type']
