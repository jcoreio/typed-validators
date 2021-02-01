import Type from '../types/Type'
import { IdentifierPath, stringifyPath } from '../Validation'
import RuntimeTypeErrorItem from './RuntimeTypeErrorItem'

export default class InvalidTypeErrorItem extends RuntimeTypeErrorItem {
  static readonly code: 'INVALID_TYPE'

  constructor(
    path: IdentifierPath,
    valueAtPath: unknown,
    expectedTypeAtPath: Type<unknown>
  ) {
    super(path, valueAtPath, expectedTypeAtPath)
  }

  toString(): string {
    return `${stringifyPath(
      this.path
    )} must be ${this.expectedTypeAtPath.toString({ formatForMustBe: true })}`
  }
}
