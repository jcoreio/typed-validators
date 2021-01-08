import Validation from '../Validation'
import { ErrorTuple, IdentifierPath } from '../Validation'
import ObjectType from './ObjectType'
import makeTypeError from '../errorReporting/makeTypeError'

/**
 * # Type
 *
 * This is the base class for all types.
 */
export default abstract class Type<T> {
  readonly __type: T = null as any
  typeName = 'Type'

  resolveObjectType(): ObjectType<T> {
    throw new Error(
      `invalid type used where an object was expected: ${this.toString()}`
    )
  }

  abstract errors(
    /* eslint-disable @typescript-eslint/no-unused-vars */
    validation: Validation,
    path: IdentifierPath,
    input: any
    /* eslint-enable @typescript-eslint/no-unused-vars */
  ): Generator<ErrorTuple, void, void>

  abstract accepts(input: any): input is T

  assert<V extends T>(input: any, prefix = '', path?: IdentifierPath): V {
    const validation = this.validate(input, prefix, path)
    const error = makeTypeError(validation)
    if (error) {
      throw error
    }
    return input
  }

  validate(input: any, prefix = '', path?: IdentifierPath): Validation {
    const validation = new Validation(input, prefix, path)
    for (const error of this.errors(validation, [], input))
      validation.errors.push(error)
    return validation
  }

  abstract toString(): string
}
