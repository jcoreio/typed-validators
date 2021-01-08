import Type from './Type'
import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default class TupleType<T extends any[]> extends Type<T> {
  typeName = 'TupleType'
  readonly types: { [Index in keyof T]: Type<T[Index]> }

  constructor(types: { [Index in keyof T]: Type<T[Index]> }) {
    super()
    this.types = types
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    const { types } = this
    if (!Array.isArray(input)) {
      yield [path, getErrorMessage('ERR_EXPECT_ARRAY'), this]
      return
    }
    if (input.length !== types.length) {
      yield [path, getErrorMessage('ERR_EXPECT_LENGTH', types.length), this]
    }
    for (let i = 0; i < Math.min(input.length, types.length); i++) {
      yield* (types[i] as Type<any>).errors(
        validation,
        path.concat(i),
        input[i]
      )
    }
  }

  accepts(input: any): input is T {
    const { types } = this
    const { length } = types

    if (!Array.isArray(input) || input.length !== length) {
      return false
    }
    for (let i = 0; i < length; i++) {
      const type = types[i] as Type<any>
      if (!type.accepts(input[i])) {
        return false
      }
    }
    return true
  }
  protected acceptsSpecificType(type: Type<any>): boolean {
    if (!(type instanceof TupleType)) return false
    const typeElems = (type.types as any) as Type<any>[]
    const thisElems = (this.types as any) as Type<any>[]
    return (
      typeElems.length === thisElems.length &&
      thisElems.every((type, index) => type.acceptsType(typeElems[index]))
    )
  }

  toString(): string {
    return `[${this.types.join(', ')}]`
  }
}
