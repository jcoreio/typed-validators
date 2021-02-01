import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'

export default class IntersectionType<T> extends Type<T> {
  typeName = 'IntersectionType'
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
      yield* types[i].errors(validation, path, input)
    }
  }

  accepts(input: any): input is T {
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      const type = types[i]
      if (!type.accepts(input)) {
        return false
      }
    }
    return true
  }

  get acceptsSomeCompositeTypes(): boolean {
    return this.types.some(t => t.acceptsSomeCompositeTypes)
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    if (options?.formatForMustBe) {
      const formatted = this.toString()
      return /\n/.test(formatted)
        ? `of type:\n\n${formatted.replace(/^/gm, '  ')}`
        : `of type ${formatted}`
    }
    return this.types.join(' & ')
  }
}
