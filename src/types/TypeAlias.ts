import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import {
  addConstraints,
  collectConstraintErrors,
  constraintsAccept,
  TypeConstraint,
} from '../typeConstraints'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'

export default class TypeAlias<T> extends Type<T> {
  typeName = 'TypeAlias'
  readonly name: string
  readonly type: Type<T>
  readonly constraints: TypeConstraint<T>[] = []

  constructor(name: string, type: Type<T>) {
    super()
    this.name = name
    this.type = type
  }

  resolveType(): Type<T> {
    return this.type.resolveType()
  }

  addConstraint(...constraints: TypeConstraint<T>[]): this {
    addConstraints(this, ...constraints)
    return this
  }

  get hasConstraints(): boolean {
    return this.constraints.length > 0
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    const { type } = this
    let hasErrors = false
    for (const error of type.errors(validation, path, input)) {
      hasErrors = true
      yield error
    }
    if (!hasErrors) {
      yield* collectConstraintErrors(this, validation, path, input)
    }
  }

  accepts(input: any): input is T {
    const { type } = this
    if (!type.accepts(input)) {
      return false
    } else if (!constraintsAccept(this, input)) {
      return false
    } else {
      return true
    }
  }

  get acceptsSomeCompositeTypes(): boolean {
    return this.type.acceptsSomeCompositeTypes
  }

  toString(): string {
    return this.name
  }
}
