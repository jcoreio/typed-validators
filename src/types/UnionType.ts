import Type from './Type'
import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

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
  ): Generator<ErrorTuple, void, void> {
    const { types } = this
    const { length } = types
    for (let i = 0; i < length; i++) {
      const type = types[i]
      if (type.accepts(input)) {
        return
      }
    }
    if (input != null) {
      const deepErrors: ErrorTuple[][] = this.types
        .map(t => [...t.errors(validation, path, input)])
        .filter(errors => errors.find(([path]) => path.length > 0))
      if (deepErrors.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        yield* deepErrors[0] as any
        return
      }
    }
    yield [path, getErrorMessage('ERR_NO_UNION', this.toString()), this]
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

  toString(): string {
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
