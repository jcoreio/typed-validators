import { RuntimeTypeErrorItem } from '.'
import ViolatedConstraintErrorItem from './errorReporting/ViolatedConstraintErrorItem'
import Type from './types/Type'
import Validation, { IdentifierPath } from './Validation'

export type TypeConstraint<T> = (input: T) => string | null | undefined

export type ConstrainableType<T> = Type<T> & {
  constraints: TypeConstraint<T>[]
}

/**
 * Collect any errors from constraints on the given subject type.
 */
export function* collectConstraintErrors(
  subject: ConstrainableType<any>,
  validation: Validation,
  path: IdentifierPath,
  input: any
): Iterable<RuntimeTypeErrorItem> {
  const { constraints } = subject
  const { length } = constraints
  for (let i = 0; i < length; i++) {
    const constraint = constraints[i]
    const violation = (constraint as any)(input)
    if (typeof violation === 'string') {
      yield new ViolatedConstraintErrorItem(path, input, subject, violation)
    }
  }
}

/**
 * Determine whether the input passes the constraints on the subject type.
 */
export function constraintsAccept(
  subject: ConstrainableType<any>,
  ...input: any[]
): boolean {
  const { constraints } = subject
  const { length } = constraints
  for (let i = 0; i < length; i++) {
    const constraint = constraints[i]
    if (typeof (constraint as any)(...input) === 'string') {
      return false
    }
  }
  return true
}
