import Type from './Type'
import {
  collectConstraintErrors,
  constraintsAccept,
  TypeConstraint,
} from '../typeConstraints'

import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import MissingPropertyErrorItem from '../errorReporting/MissingPropertyErrorItem'

export default class ObjectTypeProperty<
  K extends string | number | symbol,
  V
> extends Type<V> {
  typeName = 'ObjectTypeProperty'
  readonly key: K
  readonly value: Type<V>
  readonly optional: boolean
  readonly constraints: TypeConstraint<V>[] = []
  __objectType: Type<any> = null as any

  constructor(key: K, value: Type<V>, optional: boolean) {
    super()
    this.key = key
    this.value = value
    this.optional = optional
  }

  clone(): ObjectTypeProperty<K, V> {
    return new ObjectTypeProperty(this.key, this.value, this.optional)
  }

  addConstraint(...constraints: TypeConstraint<V>[]): ObjectTypeProperty<K, V> {
    this.constraints.push(...constraints)
    return this
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
    let hasErrors = false
    for (const error of value.errors(validation, targetPath, target)) {
      hasErrors = true
      yield error
    }
    if (!hasErrors) {
      yield* collectConstraintErrors(this, validation, targetPath, target)
    }
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

    if (!value.accepts(target)) {
      return false
    } else {
      return constraintsAccept(this, target)
    }
  }

  toString(): string {
    let key: any = this.key
    if (typeof key === 'symbol') {
      key = `[${key.toString()}]`
    }
    return `${key}${this.optional ? '?' : ''}: ${this.value.toString()}`
  }
}
