import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'

export default abstract class PrimitiveLiteralType<
  T extends string | number | boolean | symbol | bigint | null | undefined
> extends Type<T> {
  typeName = 'PrimitiveLiteralType'
  readonly value: T

  constructor(value: T) {
    super()
    this.value = value
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    if (!this.accepts(input)) {
      yield new InvalidTypeErrorItem(path, input, this)
    }
  }

  accepts(input: any): input is T {
    return Object.is(input, this.value)
  }

  toString(): string {
    return String(this.value)
  }
}
