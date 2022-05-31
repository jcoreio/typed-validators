import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'

export default class TypeReference<T> extends Type<T> {
  typeName = 'TypeReference'
  readonly type: () => Type<any>

  constructor(type: () => Type<any>) {
    super()
    this.type = type
  }

  resolveType(): Type<any> {
    return this.type().resolveType()
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    yield* this.type().errors(validation, path, input)
  }

  accepts(input: any): input is T {
    return this.type().accepts(input)
  }

  get acceptsSomeCompositeTypes(): boolean {
    return this.type().acceptsSomeCompositeTypes
  }

  toString(): string {
    return this.type().toString()
  }
}
