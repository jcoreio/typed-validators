import Type from './Type'

import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default class NullLiteralType extends Type<null> {
  typeName = 'NullLiteralType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    if (input !== null) {
      yield [path, getErrorMessage('ERR_EXPECT_NULL'), this]
    }
  }

  accepts(input: any): input is null {
    return input === null
  }

  protected acceptsSpecificType(type: Type<any>): boolean {
    return type instanceof NullLiteralType
  }

  toString(): string {
    return 'null'
  }
}
