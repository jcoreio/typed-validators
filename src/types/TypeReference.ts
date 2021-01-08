import Type from './Type'
import TypeAlias from './TypeAlias'
import ObjectType from './ObjectType'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default class TypeReference<T> extends Type<T> {
  typeName = 'TypeReference'
  readonly type: () => TypeAlias<T>

  constructor(type: () => TypeAlias<T>) {
    super()
    this.type = type
  }

  resolveObjectType(): ObjectType<T> {
    return this.type().resolveObjectType()
  }

  *errors(
    validation: Validation<any>,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    yield* this.type().errors(validation, path, input)
  }

  accepts(input: any): input is T {
    return this.type().accepts(input)
  }

  toString(): string {
    return this.type().toString()
  }
}
