import Type from './Type'

import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default class BooleanLiteralType<T extends boolean> extends Type<T> {
  typeName = 'BooleanLiteralType'
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
    if (input !== this.value) {
      yield [
        path,
        getErrorMessage(this.value ? 'ERR_EXPECT_TRUE' : 'ERR_EXPECT_FALSE'),
        this,
      ]
    }
  }

  accepts(input: any): input is T {
    return input === this.value
  }

  toString(): string {
    return this.value ? 'true' : 'false'
  }
}
