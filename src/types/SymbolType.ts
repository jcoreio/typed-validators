import Type from './Type'
import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'
import SymbolLiteralType from './SymbolLiteralType'

export default class SymbolType extends Type<symbol> {
  typeName = 'SymbolType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    // @flowIssue 252
    if (typeof input !== 'symbol') {
      yield [path, getErrorMessage('ERR_EXPECT_SYMBOL'), this]
    }
  }

  accepts(input: any): input is symbol {
    return typeof input === 'symbol'
  }

  protected acceptsSpecificType(type: Type<any>): boolean {
    return type instanceof SymbolType || type instanceof SymbolLiteralType
  }

  toString(): string {
    return 'symbol'
  }
}
