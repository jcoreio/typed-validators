import Type from './Type'
import ObjectType from './ObjectType'
import ObjectTypeProperty from './ObjectTypeProperty'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'

export default class MergedObjectType<T extends {}> extends Type<T> {
  typeName = 'MergedObjectType'
  readonly objects: Type<T>[]
  readonly exact: boolean
  private resolved: ObjectType<T> | undefined

  constructor(objects: Type<T>[], exact = true) {
    super()
    this.objects = objects
    this.exact = exact
  }

  resolveType(): Type<T> {
    if (!this.resolved) {
      const properties: Record<any, ObjectTypeProperty<any, any>> = {}
      for (const object of this.objects) {
        const resolved = object.resolveType()
        if (!(resolved instanceof ObjectType)) {
          throw new Error(
            `a merged type didn't resolve to an ObjectType: ${object.toString()}${
              resolved !== object ? ` (resolved to ${resolved.toString()})` : ''
            }`
          )
        }
        for (const property of resolved.properties) {
          properties[property.key as any] = property.clone()
        }
      }
      this.resolved = new ObjectType(Object.values(properties), this.exact)
    }
    return this.resolved
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    yield* this.resolveType().errors(validation, path, input)
  }

  accepts(input: any): input is T {
    return this.resolveType().accepts(input)
  }

  get acceptsSomeCompositeTypes(): boolean {
    return true
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    return this.resolveType().toString(options)
  }
}
