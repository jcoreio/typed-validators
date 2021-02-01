import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'

export default class UnionType<T> extends Type<T> {
  typeName = 'UnionType'
  readonly types: Type<any>[]

  constructor(types: Type<any>[]) {
    super()
    this.types = types
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      const type = types[i]
      if (type.accepts(input)) {
        return
      }
    }
    if (input != null) {
      const deepErrors: RuntimeTypeErrorItem[][] = this.types
        .map(t => [...t.errors(validation, path, input)])
        .filter(errors => errors.find(e => e.depth > path.length))
      if (deepErrors.length === 1) {
        yield* deepErrors[0]
        return
      }
    }
    yield new InvalidTypeErrorItem(path, input, this)
  }

  accepts(input: any): input is T {
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      const type = types[i]
      if (type.accepts(input)) {
        return true
      }
    }
    return false
  }

  get acceptsSomeCompositeTypes(): boolean {
    return this.types.some(t => t.acceptsSomeCompositeTypes)
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    if (options?.formatForMustBe) {
      const formatted = this.toString()
      return /\n/.test(formatted)
        ? `one of:\n\n${formatted.replace(/^/gm, '  ')}`
        : `one of ${formatted}`
    }
    const { types } = this
    const normalized = new Array(types.length)
    for (let i = 0; i < types.length; i++) {
      const type = types[i]
      if (
        type.typeName === 'FunctionType' ||
        type.typeName === 'ParameterizedFunctionType'
      ) {
        normalized[i] = `(${type.toString()})`
      } else {
        normalized[i] = type.toString()
      }
    }
    return normalized.join(' | ')
  }
}
