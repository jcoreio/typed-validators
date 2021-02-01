import Type from '../types/Type'
import ObjectTypeProperty from '../types/ObjectTypeProperty'
import RuntimeTypeErrorItem from './RuntimeTypeErrorItem'
import { IdentifierPath, stringifyPath } from '../Validation'
import { keyToString } from './keyToString'

export default class MissingPropertyErrorItem extends RuntimeTypeErrorItem {
  static readonly code: 'MISSING_PROPERTY'
  readonly propertyType: ObjectTypeProperty<any, any>

  constructor(
    path: IdentifierPath,
    valueAtPath: unknown,
    expectedTypeAtPath: Type<any>,
    propertyType: ObjectTypeProperty<any, any>
  ) {
    super(path, valueAtPath, expectedTypeAtPath, path.length + 1)
    this.propertyType = propertyType
  }

  toString(): string {
    return `${stringifyPath(
      this.path
    )} is missing required property ${keyToString(
      this.propertyType.key
    )}, which must be ${this.propertyType.value.toString({
      formatForMustBe: true,
    })}`
  }
}
