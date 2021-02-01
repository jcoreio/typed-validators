import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'

export default class NumberType extends Type<number> {
  typeName = 'NumberType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    if (typeof input !== 'number') {
      yield new InvalidTypeErrorItem(path, input, this)
    }
  }

  accepts(input: any): input is number {
    return typeof input === 'number'
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    return options?.formatForMustBe ? 'a number' : 'number'
  }
}
