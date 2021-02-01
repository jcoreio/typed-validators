import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import InvalidLengthErrorItem from '../errorReporting/InvalidLengthErrorItem'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'

export default class TupleType<T extends any[]> extends Type<T> {
  typeName = 'TupleType'
  readonly types: { [Index in keyof T]: Type<T[Index]> }

  constructor(types: { [Index in keyof T]: Type<T[Index]> }) {
    super()
    this.types = types
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    const { types } = this
    if (!Array.isArray(input)) {
      yield new InvalidTypeErrorItem(path, input, this)
      return
    }
    if (input.length !== types.length) {
      yield new InvalidLengthErrorItem(path, input, this, types.length)
    }
    for (let i = 0; i < Math.min(input.length, types.length); i++) {
      yield* (types[i] as Type<any>).errors(
        validation,
        path.concat(i),
        input[i]
      )
    }
  }

  accepts(input: any): input is T {
    const { types } = this
    const { length } = types

    if (!Array.isArray(input) || input.length !== length) {
      return false
    }
    for (let i = 0; i < length; i++) {
      const type = types[i] as Type<any>
      if (!type.accepts(input[i])) {
        return false
      }
    }
    return true
  }

  get acceptsSomeCompositeTypes(): boolean {
    return true
  }

  toString(): string {
    return `[${this.types.join(', ')}]`
  }
}
