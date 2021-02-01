import Type from '../types/Type'
import RuntimeTypeErrorItem from './RuntimeTypeErrorItem'
import { IdentifierPath, stringifyPath } from '../Validation'

export default class InvalidLengthErrorItem extends RuntimeTypeErrorItem {
  static readonly code: 'INVALID_LENGTH'
  readonly valueAtPath: Array<unknown>
  readonly expectedLength: number

  constructor(
    path: IdentifierPath,
    valueAtPath: Array<unknown>,
    expectedTypeAtPath: Type<unknown>,
    expectedLength: number
  ) {
    super(path, valueAtPath, expectedTypeAtPath, path.length + 1)
    this.valueAtPath = valueAtPath
    this.expectedLength = expectedLength
  }

  toString(): string {
    return `${stringifyPath(this.path)}.length must be ${
      this.expectedLength
    }, instead it is ${this.valueAtPath.length}`
  }
}
