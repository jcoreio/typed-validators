import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'

export default class SymbolType extends Type<symbol> {
  typeName = 'SymbolType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    // @flowIssue 252
    if (typeof input !== 'symbol') {
      yield new InvalidTypeErrorItem(path, input, this)
    }
  }

  accepts(input: any): input is symbol {
    return typeof input === 'symbol'
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    return options?.formatForMustBe ? 'a symbol' : 'symbol'
  }
}
