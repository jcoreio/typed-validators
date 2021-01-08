import Type from './Type'
import BooleanLiteralType from './BooleanLiteralType'
import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default class BooleanType extends Type<boolean> {
  typeName = 'BooleanType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    if (typeof input !== 'boolean') {
      yield [path, getErrorMessage('ERR_EXPECT_BOOLEAN'), this]
    }
  }

  accepts(input: any): input is boolean {
    return typeof input === 'boolean'
  }

  protected acceptsSpecificType(type: Type<any>): boolean {
    return type instanceof BooleanType || type instanceof BooleanLiteralType
  }

  toString(): string {
    return 'boolean'
  }
}
