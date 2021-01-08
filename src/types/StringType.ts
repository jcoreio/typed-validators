import Type from './Type'
import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'
import StringLiteralType from './StringLiteralType'

export default class StringType extends Type<string> {
  typeName = 'StringType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    if (typeof input !== 'string') {
      yield [path, getErrorMessage('ERR_EXPECT_STRING'), this]
    }
  }

  accepts(input: any): input is string {
    return typeof input === 'string'
  }
  protected acceptsSpecificType(type: Type<any>): boolean {
    return type instanceof StringType || type instanceof StringLiteralType
  }

  toString(): string {
    return 'string'
  }
}
