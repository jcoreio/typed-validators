import Type from './Type'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default class IntersectionType<T> extends Type<T> {
  typeName = 'IntersectionType'
  readonly types: Type<any>[]

  constructor(types: Type<any>[]) {
    super()
    this.types = types
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      yield* types[i].errors(validation, path, input)
    }
  }

  accepts(input: any): input is T {
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

  protected acceptsSpecificType(type: Type<any>): boolean {
    if (type instanceof IntersectionType) {
      return type.types.every(t => this.acceptsType(t))
    }
    return this.types.every(t => t.acceptsType(type))
  }

  toString(): string {
    return this.types.join(' & ')
  }
}
