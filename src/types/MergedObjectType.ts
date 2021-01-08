import Type from './Type'
import ObjectType from './ObjectType'
import ObjectTypeProperty from './ObjectTypeProperty'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

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

  resolveObjectType(): ObjectType<T> {
    if (!this.resolved) {
      const properties: Record<any, ObjectTypeProperty<any, any>> = {}
      for (const object of this.objects) {
        for (const property of object.resolveObjectType().properties) {
          properties[property.key] = property
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
  ): Generator<ErrorTuple, void, void> {
    yield* this.resolveObjectType().errors(validation, path, input)
  }

  accepts(input: any): input is T {
    return this.resolveObjectType().accepts(input)
  }

  protected acceptsSpecificType(type: Type<any>): boolean {
    return this.resolveObjectType().acceptsType(type)
  }

  toString(): string {
    return this.resolveObjectType().toString()
  }
}
