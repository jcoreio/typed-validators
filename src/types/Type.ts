import Validation from '../Validation'
import { IdentifierPath } from '../Validation'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import { RuntimeTypeError } from '..'

/**
 * # Type
 *
 * This is the base class for all types.
 */
export default abstract class Type<T> {
  readonly __type: T = null as any
  typeName = 'Type'

  resolveType(): Type<T> {
    return this
  }

  abstract errors(
    /* eslint-disable @typescript-eslint/no-unused-vars */
    validation: Validation,
    path: IdentifierPath,
    input: any
    /* eslint-enable @typescript-eslint/no-unused-vars */
  ): Iterable<RuntimeTypeErrorItem>

  abstract accepts(input: any): input is T

  get acceptsSomeCompositeTypes(): boolean {
    return false
  }

  assert<V extends T>(
    input: any,
    prefix = '',
    path: IdentifierPath = ['input']
  ): V {
    const validation = this.validate(input, prefix, path)
    if (validation.errors.length) {
      throw new RuntimeTypeError(validation.errors)
    }
    return input
  }

  validate(
    input: any,
    prefix = '',
    path: IdentifierPath = ['input']
  ): Validation {
    const validation = new Validation(input, prefix, path)
    for (const error of this.errors(validation, path, input))
      validation.errors.push(error)
    return validation
  }

  abstract toString(options?: { formatForMustBe?: boolean }): string
}
