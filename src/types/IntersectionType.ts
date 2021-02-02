import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import ObjectType from './ObjectType'
import MergedObjectType from './MergedObjectType'
import UnionType from './UnionType'

export default class IntersectionType<T> extends Type<T> {
  typeName = 'IntersectionType'
  readonly types: Type<any>[]
  private resolved: Type<T> | undefined

  constructor(types: Type<any>[]) {
    super()
    this.types = types
  }

  resolveType(): Type<T> {
    if (!this.resolved) {
      const objects: ObjectType<any>[] = []
      const rest: Type<any>[] = []
      for (const t of this.types) {
        const type = t.resolveType()
        if (type instanceof ObjectType) objects.push(type)
        else rest.push(type)
      }
      if (objects.length && !rest.length) {
        this.resolved = new MergedObjectType(
          objects,
          !objects.find(obj => obj.exact === false)
        ).resolveType()
      } else {
        this.resolved = this
      }
    }
    return this.resolved
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    const resolved = this.resolveType()
    if (resolved !== this) {
      yield* resolved.errors(validation, path, input)
      return
    }
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      yield* types[i].errors(validation, path, input)
    }
  }

  accepts(input: any): input is T {
    const resolved = this.resolveType()
    if (resolved !== this) return resolved.accepts(input)
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      const type = types[i]
      if (!type.accepts(input)) {
        return false
      }
    }
    return true
  }

  get acceptsSomeCompositeTypes(): boolean {
    const resolved = this.resolveType()
    if (resolved !== this) return resolved.acceptsSomeCompositeTypes
    return this.types.some(t => t.acceptsSomeCompositeTypes)
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    if (options?.formatForMustBe) {
      const formatted = this.toString()
      return /\n/.test(formatted)
        ? `of type:\n\n${formatted.replace(/^/gm, '  ')}`
        : `of type ${formatted}`
    }
    return this.types
      .map(type =>
        type instanceof UnionType || type instanceof IntersectionType
          ? `(${type.toString()})`
          : type.toString()
      )
      .join(' & ')
  }
}
