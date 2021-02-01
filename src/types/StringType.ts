import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'

export default class StringType extends Type<string> {
  typeName = 'StringType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    if (typeof input !== 'string') {
      yield new InvalidTypeErrorItem(path, input, this)
    }
  }

  accepts(input: any): input is string {
    return typeof input === 'string'
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    return options?.formatForMustBe ? 'a string' : 'string'
  }
}
