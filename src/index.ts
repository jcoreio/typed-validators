import AnyType from './types/AnyType'
import ArrayType from './types/ArrayType'
import BooleanLiteralType from './types/BooleanLiteralType'
import BooleanType from './types/BooleanType'
import InstanceOfType, { Constructor } from './types/InstanceOfType'
import IntersectionType from './types/IntersectionType'
import merge from './merge'
import MergedObjectType from './types/MergedObjectType'
import mergeInexact from './mergeInexact'
import NullLiteralType from './types/NullLiteralType'
import NumberType from './types/NumberType'
import NumericLiteralType from './types/NumericLiteralType'
import ObjectType from './types/ObjectType'
import ObjectTypeProperty from './types/ObjectTypeProperty'
import OpaqueType from './types/OpaqueType'
import oneOf from './oneOf'
import PrimitiveLiteralType from './types/PrimitiveLiteralType'
import RecordType from './types/RecordType'
import RuntimeTypeError from './errorReporting/RuntimeTypeError'
import RuntimeTypeErrorItem from './errorReporting/RuntimeTypeErrorItem'
import StringLiteralType from './types/StringLiteralType'
import StringType from './types/StringType'
import SymbolLiteralType from './types/SymbolLiteralType'
import SymbolType from './types/SymbolType'
import TupleType from './types/TupleType'
import Type from './types/Type'
import TypeAlias from './types/TypeAlias'
import TypeReference from './types/TypeReference'
import UndefinedLiteralType from './types/UndefinedLiteralType'
import UnionType from './types/UnionType'
import UnknownType from './types/UnknownType'
import Validation from './Validation'

export {
  AnyType,
  ArrayType,
  BooleanLiteralType,
  BooleanType,
  InstanceOfType,
  IntersectionType,
  merge,
  MergedObjectType,
  mergeInexact,
  NullLiteralType,
  NumberType,
  NumericLiteralType,
  ObjectType,
  ObjectTypeProperty,
  OpaqueType,
  oneOf,
  PrimitiveLiteralType,
  RecordType,
  RuntimeTypeError,
  RuntimeTypeErrorItem,
  StringLiteralType,
  StringType,
  SymbolLiteralType,
  SymbolType,
  TupleType,
  Type,
  TypeAlias,
  TypeReference,
  UndefinedLiteralType,
  UnionType,
  UnknownType,
  Validation,
}

export const any = (): Type<any> => new AnyType()
export const unknown = (): Type<unknown> => new UnknownType()
export const opaque = <T>(type: () => Type<any>): OpaqueType<T> =>
  new OpaqueType<T>(type)

export const array = <T>(elementType: Type<T>): Type<T[]> =>
  new ArrayType(elementType)

export const readonlyArray = <T>(elementType: Type<T>): Type<readonly T[]> =>
  new ArrayType(elementType) as any
export const readonly = <T extends Record<string, any>>(
  type: Type<T>
): Type<Readonly<T>> => type as any

export const nullLiteral = (): Type<null> => new NullLiteralType()
export { nullLiteral as null }
export const nullOr = <T>(type: Type<T>): Type<T | null> =>
  oneOf(type, nullLiteral())

export const undefinedLiteral = (): Type<undefined> =>
  new UndefinedLiteralType()
export { undefinedLiteral as undefined }

export const nullish = (): Type<null | undefined> =>
  oneOf(nullLiteral(), undefinedLiteral())
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

function entries<O extends Record<string, any>>(
  obj: O
): [string | symbol, any][] {
  return [
    ...Object.entries(obj),
    ...Object.getOwnPropertySymbols(obj).map((s) => [s, (obj as any)[s]]),
  ] as any
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
        ...entries(required || {}).map(
          ([key, type]) => new ObjectTypeProperty(key, type, false)
        ),
        ...entries(optional || {}).map(
          ([key, type]) => new ObjectTypeProperty(key, type, true)
        ),
      ] as any,
      exact !== false
    ) as any
  }
  return new ObjectType(
    entries(options).map(
      ([key, type]) => new ObjectTypeProperty(key, type, false)
    ) as any,
    true
  ) as any
}

export const record = <K extends string | number | symbol, V>(
  key: Type<K>,
  value: Type<V>
): RecordType<K, V> => new RecordType(key, value)

export const instanceOf = <T>(classType: () => Constructor<T>): Type<T> =>
  new InstanceOfType(classType)

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
