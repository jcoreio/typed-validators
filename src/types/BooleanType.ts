import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'

export default class BooleanType extends Type<boolean> {
  typeName = 'BooleanType';

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    if (typeof input !== 'boolean') {
      yield new InvalidTypeErrorItem(path, input, this)
    }
  }

  accepts(input: any): input is boolean {
    return typeof input === 'boolean'
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    return options?.formatForMustBe ? 'a boolean' : 'boolean'
  }
}
