import Type from './Type'

import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'
import NumericLiteralType from './NumericLiteralType'

export default class NumberType extends Type<number> {
  typeName = 'NumberType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    if (typeof input !== 'number') {
      yield [path, getErrorMessage('ERR_EXPECT_NUMBER'), this]
    }
  }

  accepts(input: any): input is number {
    return typeof input === 'number'
  }
  protected acceptsSpecificType(type: Type<any>): boolean {
    return type instanceof NumberType || type instanceof NumericLiteralType
  }

  toString(): string {
    return 'number'
  }
}
