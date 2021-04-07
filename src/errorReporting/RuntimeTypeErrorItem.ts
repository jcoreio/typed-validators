import { IdentifierPath, stringifyPath } from '../Validation'
import Type from '../types/Type'

export default abstract class RuntimeTypeErrorItem {
  static readonly code: string = ''
  readonly path: IdentifierPath
  readonly valueAtPath: unknown
  readonly expectedTypeAtPath: Type<unknown>
  readonly depth: number

  constructor(
    path: IdentifierPath,
    valueAtPath: unknown,
    expectedTypeAtPath: Type<unknown>,
    depth: number = path.length
  ) {
    this.path = path
    this.valueAtPath = valueAtPath
    this.expectedTypeAtPath = expectedTypeAtPath
    this.depth = depth
  }

  abstract messageAtPath(): string

  toString(): string {
    return `${stringifyPath(this.path)} ${this.messageAtPath()}`
  }
}
