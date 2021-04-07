import Type from '../types/Type'
import { IdentifierPath } from '../Validation'
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

  messageAtPath(): string {
    return `must be ${this.expectedTypeAtPath.toString({
      formatForMustBe: true,
    })}`
  }
}
