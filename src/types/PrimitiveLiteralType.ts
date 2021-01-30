import Type from './Type'
import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default abstract class PrimitiveLiteralType<
  T extends string | number | boolean | symbol | bigint | null | undefined
> extends Type<T> {
  typeName = 'PrimitiveLiteralType'
  readonly value: T

  constructor(value: T) {
    super()
    this.value = value
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    if (!this.accepts(input)) {
      yield [
        path,
        getErrorMessage('ERR_EXPECT_EXACT_VALUE', this.toString()),
        this,
      ]
    }
  }

  accepts(input: any): input is T {
    return Object.is(input, this.value)
  }

  toString(): string {
    return String(this.value)
  }
}
