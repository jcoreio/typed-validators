import Type from './Type'

import ObjectTypeProperty from './ObjectTypeProperty'
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
import UnknownPropertyErrorItem from '../errorReporting/UnknownPropertyErrorItem'

export default class ObjectType<T extends {}> extends Type<T> {
  typeName = 'ObjectType'
  readonly properties: ObjectTypeProperty<keyof T, any>[]
  readonly exact: boolean

  constructor(
    properties: ObjectTypeProperty<keyof T, any>[] = [],
    exact = true
  ) {
    super()
    for (let i = 0; i < properties.length; i++) {
      if (!(properties[i] instanceof ObjectTypeProperty)) {
        throw new Error(
          `properties[${i}] must be an instance of ObjectTypeProperty`
        )
      }
    }
    this.properties = properties
    this.exact = exact
    properties.forEach(prop => (prop.__objectType = this))
  }

  resolveObjectType(): ObjectType<T> {
    return this
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

    yield* collectErrorsWithoutIndexers(this, validation, path, input)
    if (this.exact) {
      yield* collectErrorsExact(this, validation, path, input)
    }
    validation.endCycle(this, input)
  }

  accepts(input: any): input is T {
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

    let result
    result = acceptsWithoutIndexers(this, input)
    if (result && this.exact) {
      result = acceptsExact(this, input)
    }
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
    const { properties } = this
    if (inToStringCycle(this)) {
      return '$Cycle<Record<string, any>>'
    }
    startToStringCycle(this)
    const body = []
    for (let i = 0; i < properties.length; i++) {
      body.push(properties[i].toString())
    }
    endToStringCycle(this)
    return `{\n${indent(body.join('\n'))}\n}`
  }
}

function acceptsWithoutIndexers(
  type: ObjectType<any>,
  input: Record<string, any>
): boolean {
  const { properties } = type
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i]
    if (!property.accepts(input)) {
      return false
    }
  }
  return true
}

function acceptsExact(
  type: ObjectType<any>,
  input: Record<string, any>
): boolean {
  const { properties } = type
  for (const key in input) {
    // eslint-disable-line guard-for-in
    if (!properties.some(property => property.key === key)) {
      return false
    }
  }
  return true
}

function* collectErrorsWithoutIndexers(
  type: ObjectType<any>,
  validation: Validation,
  path: IdentifierPath,
  input: Record<string, any>
): Iterable<RuntimeTypeErrorItem> {
  const { properties } = type
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i]
    yield* property.errors(validation, path, input)
  }
}

function* collectErrorsExact(
  type: ObjectType<any>,
  validation: Validation,
  path: IdentifierPath,
  input: Record<string, any>
): Iterable<RuntimeTypeErrorItem> {
  const { properties } = type
  for (const key in input) {
    // eslint-disable-line guard-for-in
    if (!properties.some(property => property.key === key)) {
      yield new UnknownPropertyErrorItem(path, input, type, key)
    }
  }
}

function indent(input: string): string {
  const lines = input.split('\n')
  const { length } = lines
  for (let i = 0; i < length; i++) {
    lines[i] = `  ${lines[i]}`
  }
  return lines.join('\n')
}
