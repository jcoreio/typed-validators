import Type from './Type'
import TypeAlias from './TypeAlias'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default class TypeReference<T> extends Type<T> {
  typeName = 'TypeReference'
  readonly type: () => TypeAlias<T>

  constructor(type: () => TypeAlias<T>) {
    super()
    this.type = type
  }

  resolveType(): Type<T> {
    return this.type().resolveType()
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
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
