import Type, { assertIsType } from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'
import ObjectTypeProperty from './ObjectTypeProperty'
import PrimitiveLiteralType from './PrimitiveLiteralType'
import IntersectionType from './IntersectionType'
import NullLiteralType from './NullLiteralType'
import ObjectType from './ObjectType'
import UndefinedLiteralType from './UndefinedLiteralType'

function getDeterminantProperty(
  types: Type<any>[]
): [string | number | symbol, Map<any, Type<any>>] | null {
  const objTypes: ObjectType<any>[] = []
  for (const type of types) {
    const t = type.resolveType()
    if (t instanceof NullLiteralType || t instanceof UndefinedLiteralType)
      continue
    if (t instanceof ObjectType) objTypes.push(t)
  }
  if (!objTypes.length) return null
  const propertyMaps: Map<
    string | number | symbol,
    ObjectTypeProperty<any, any>
  >[] = objTypes.map(
    ({ properties }) => new Map(properties.map((p) => [p.key, p]))
  )
  const potential: ([string | number | symbol, Map<any, Type<any>>] | null)[] =
    objTypes[0].properties
      .map(
        (
          p: ObjectTypeProperty<any, any>
        ): [string | number | symbol, Map<any, Type<any>>] | null => {
          const eachProperty = propertyMaps.map((m) => m.get(p.key))
          const valueMap: Map<any, Type<any>> = new Map()
          for (const property of eachProperty) {
            if (!property) return null
            const { value } = property
            if (
              !(value instanceof PrimitiveLiteralType) ||
              value instanceof NullLiteralType ||
              value instanceof UndefinedLiteralType ||
              valueMap.has(value.value)
            )
              return null

            valueMap.set(value.value, property.__objectType)
          }
          return [p.key, valueMap]
        }
      )
      .filter((p) => p != null)
  return potential.length === 1 ? potential[0] : null
}

export default class UnionType<T> extends Type<T> {
  typeName = 'UnionType'
  readonly types: Type<any>[]
  private _determinantProperty:
    | [string | number | symbol, Map<any, Type<any>>]
    | null
    | undefined

  constructor(types: Type<any>[]) {
    super()
    for (let i = 0; i < types.length; i++) {
      assertIsType(types[i], `types[${i}]`)
    }
    this.types = types
  }

  get determinantProperty():
    | [string | number | symbol, Map<any, Type<any>>]
    | null {
    return this._determinantProperty === undefined
      ? (this._determinantProperty = getDeterminantProperty(this.types))
      : this._determinantProperty
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      const type = types[i]
      if (type.accepts(input)) {
        return
      }
    }
    if (input != null) {
      const deepErrors: RuntimeTypeErrorItem[][] = this.types
        .map((t) => [...t.errors(validation, path, input)])
        .filter((errors) => errors.find((e) => e.depth > path.length))
      if (deepErrors.length === 1) {
        yield* deepErrors[0]
        return
      }
      if (input instanceof Object) {
        const { determinantProperty } = this
        if (determinantProperty) {
          const [key, valuesMap] = determinantProperty
          const typeForValue = valuesMap.get(input[key])
          if (typeForValue) {
            yield* typeForValue.errors(validation, path, input)
            return
          }
        }
      }
    }
    yield new InvalidTypeErrorItem(path, input, this)
  }

  accepts(input: any): input is T {
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      const type = types[i]
      if (type.accepts(input)) {
        return true
      }
    }
    return false
  }

  get acceptsSomeCompositeTypes(): boolean {
    return this.types.some((t) => t.acceptsSomeCompositeTypes)
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    if (options?.formatForMustBe) {
      const formatted = this.toString()
      return /\n/.test(formatted)
        ? `one of:\n\n${formatted.replace(/^/gm, '  ')}`
        : `one of ${formatted}`
    }
    return this.types
      .map((type) =>
        type instanceof UnionType || type instanceof IntersectionType
          ? `(${type.toString()})`
          : type.toString()
      )
      .join(' | ')
  }
}
