import Type from '../types/Type'
import { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from './RuntimeTypeErrorItem'

export default class ViolatedConstraintErrorItem extends RuntimeTypeErrorItem {
  static readonly code: 'VIOLATED_CONSTRAINT'
  readonly constraintErrorMessage: string

  constructor(
    path: IdentifierPath,
    valueAtPath: unknown,
    expectedTypeAtPath: Type<unknown>,
    constraintErrorMessage: string
  ) {
    super(path, valueAtPath, expectedTypeAtPath)
    this.constraintErrorMessage = constraintErrorMessage
  }

  messageAtPath(): string {
    return this.constraintErrorMessage
  }
}
