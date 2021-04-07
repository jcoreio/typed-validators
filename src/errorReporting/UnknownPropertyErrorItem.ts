import Type from '../types/Type'
import RuntimeTypeErrorItem from './RuntimeTypeErrorItem'
import { IdentifierPath } from '../Validation'
import { keyToString } from './keyToString'

export default class UnknownPropertyErrorItem extends RuntimeTypeErrorItem {
  static readonly code: 'UNKNOWN_PROPERTY'
  readonly key: string | number | symbol

  constructor(
    path: IdentifierPath,
    valueAtPath: unknown,
    expectedTypeAtPath: Type<unknown>,
    key: string | number | symbol
  ) {
    super(path, valueAtPath, expectedTypeAtPath, path.length + 1)
    this.key = key
  }

  messageAtPath(): string {
    return `has unknown property: ${keyToString(this.key)}`
  }
}
