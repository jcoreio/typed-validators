import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'

import {
  inValidationCycle,
  startValidationCycle,
  endValidationCycle,
  inToStringCycle,
  startToStringCycle,
  endToStringCycle,
} from '../cyclic'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'
import InvalidKeyTypeErrorItem from '../errorReporting/InvalidKeyTypeErrorItem'

export default class RecordType<
  K extends string | number | symbol,
  V
> extends Type<Record<K, V>> {
  typeName = 'RecordType'
  readonly key: Type<K>
  readonly value: Type<V>

  constructor(key: Type<K>, value: Type<V>) {
    super()
    this.key = key
    this.value = value
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    if (input == null || typeof input !== 'object' || Array.isArray(input)) {
      yield new InvalidTypeErrorItem(path, input, this)
      return
    }

    if (validation.inCycle(this, input)) {
      return
    }
    validation.startCycle(this, input)

    yield* collectErrorsWithIndexers(this, validation, path, input)
  }

  accepts(input: any): input is Record<K, V> {
    if (input === null) {
      return false
    }
    if (typeof input !== 'object' || Array.isArray(input)) {
      return false
    }
    if (inValidationCycle(this, input)) {
      return true
    }
    startValidationCycle(this, input)

    const result = acceptsWithIndexers(this, input)

    endValidationCycle(this, input)
    return result
  }

  get acceptsSomeCompositeTypes(): boolean {
    return true
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    if (options?.formatForMustBe) {
      const formatted = this.toString()
      return /\n/.test(formatted)
        ? `of type:\n\n${formatted.replace(/^/gm, '  ')}`
        : `of type ${formatted}`
    }
    if (inToStringCycle(this)) {
      return '$Cycle<Record<string, any>>'
    }
    startToStringCycle(this)
    const result = `Record<${this.key}, ${this.value}>`
    endToStringCycle(this)
    return result
  }
}

function acceptsWithIndexers(
  type: RecordType<any, any>,
  input: Record<any, any>
): boolean {
  for (const key in input) {
    const value = input[key]
    if (!type.value.accepts(value)) return false
  }
  return true
}

function* collectErrorsWithIndexers(
  type: RecordType<any, any>,
  validation: Validation,
  path: IdentifierPath,
  input: Record<any, any>
): Iterable<RuntimeTypeErrorItem> {
  for (const key in input) {
    if (!type.key.accepts(key))
      yield new InvalidKeyTypeErrorItem(path, input, type, key, type.key)
    yield* type.value.errors(validation, [...path, key], input[key])
  }
}
