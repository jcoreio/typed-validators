import Type, { assertIsType } from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import MissingPropertyErrorItem from '../errorReporting/MissingPropertyErrorItem'
import { keyToString } from '../errorReporting/keyToString'

export default class ObjectTypeProperty<
  K extends string | number | symbol,
  V
> extends Type<V> {
  typeName = 'ObjectTypeProperty'
  readonly key: K
  readonly value: Type<V>
  readonly optional: boolean
  __objectType: Type<any> = null as any

  constructor(key: K, value: Type<V>, optional: boolean) {
    super()
    switch (typeof key) {
      case 'number':
      case 'string':
      case 'symbol':
        break
      default:
        throw new Error('key must be a number, string or symbol')
    }
    assertIsType(value, 'value')
    this.key = key
    this.value = value
    this.optional = optional
  }

  clone(): ObjectTypeProperty<K, V> {
    return new ObjectTypeProperty(this.key, this.value, this.optional)
  }

  /**
   * Determine whether the property exists on the given input or its prototype chain.
   */
  existsOn(input: Record<string, any>): boolean {
    // @flowIgnore
    const { key } = this
    return key in input === true
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    // @flowIgnore
    const { optional, key, value } = this
    const targetPath = path.concat(key)
    if (!optional && !this.existsOn(input)) {
      yield new MissingPropertyErrorItem(path, input, this.__objectType, this)
      return
    }
    const target = input[key]
    if (optional && target === undefined) {
      return
    }
    yield* value.errors(validation, targetPath, target)
  }

  accepts(input: Record<K, V>): input is any {
    // @flowIgnore
    const { optional, key, value } = this
    if (!optional && !this.existsOn(input)) {
      return false
    }
    const target = input[key]

    if (optional && target === undefined) {
      return true
    }

    return value.accepts(target)
  }

  toString(): string {
    return `${keyToString(this.key)}${
      this.optional ? '?' : ''
    }: ${this.value.toString()}`
  }
}
