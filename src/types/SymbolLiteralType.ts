import Type from './Type'
import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export default class SymbolLiteralType<T extends symbol> extends Type<T> {
  typeName = 'SymbolLiteralType'
  readonly value: T

  constructor(value: T) {
    super()
    this.value = value
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    const { value } = this
    if (input !== value) {
      yield [
        path,
        getErrorMessage('ERR_EXPECT_EXACT_VALUE', this.toString()),
        this,
      ]
    }
  }

  accepts(input: any): input is T {
    return input === this.value
  }
  protected acceptsSpecificType(type: Type<any>): boolean {
    return type instanceof SymbolLiteralType && type.value === this.value
  }

  toString(): string {
    return `typeof ${String(this.value)}`
  }
}
