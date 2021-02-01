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

export default class ArrayType<T> extends Type<Array<T>> {
  typeName = 'ArrayType'
  readonly elementType: Type<T>

  constructor(elementType: Type<T>) {
    super()
    this.elementType = elementType
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    if (!Array.isArray(input)) {
      yield new InvalidTypeErrorItem(path, input, this)
      return
    }
    if (validation.inCycle(this, input)) {
      return
    }
    validation.startCycle(this, input)
    const { elementType } = this
    const { length } = input

    for (let i = 0; i < length; i++) {
      yield* elementType.errors(validation, path.concat(i), input[i])
    }
    validation.endCycle(this, input)
  }

  accepts(input: any): input is Array<T> {
    if (!Array.isArray(input)) {
      return false
    }
    if (inValidationCycle(this, input)) {
      return true
    }
    startValidationCycle(this, input)
    const { elementType } = this
    const { length } = input
    for (let i = 0; i < length; i++) {
      if (!elementType.accepts(input[i])) {
        endValidationCycle(this, input)
        return false
      }
    }
    endValidationCycle(this, input)
    return true
  }

  get acceptsSomeCompositeTypes(): boolean {
    return true
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    if (options?.formatForMustBe) {
      const formatted = this.toString()
      return /\n/.test(formatted)
        ? `of type:\n\n${formatted.replace(/^/gm, '  ')}`
        : `an ${formatted}`
    }
    const { elementType } = this
    if (inToStringCycle(this)) {
      if (typeof elementType.typeName === 'string') {
        return `Array<$Cycle<${elementType.typeName}>>`
      } else {
        return `Array<$Cycle<Object>>`
      }
    }
    startToStringCycle(this)
    const output = `Array<${elementType.toString()}>`
    endToStringCycle(this)
    return output
  }
}
