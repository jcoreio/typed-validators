import Type from '../types/Type'
import { IdentifierPath } from '../Validation'
import { keyToString } from './keyToString'
import RuntimeTypeErrorItem from './RuntimeTypeErrorItem'

export default class InvalidKeyTypeErrorItem extends RuntimeTypeErrorItem {
  static readonly code: 'INVALID_KEY_TYPE'
  readonly key: string | number | symbol
  readonly expectedKeyType: Type<unknown>

  constructor(
    path: IdentifierPath,
    valueAtPath: unknown,
    expectedTypeAtPath: Type<unknown>,
    key: string | number | symbol,
    expectedKeyType: Type<unknown>
  ) {
    super(path, valueAtPath, expectedTypeAtPath, path.length + 1)
    this.key = key
    this.expectedKeyType = expectedKeyType
  }

  messageAtPath(): string {
    return `has key of invalid type: ${keyToString(
      this.key
    )}\n\nEach key must be ${this.expectedKeyType.toString({
      formatForMustBe: true,
    })}`
  }
}
