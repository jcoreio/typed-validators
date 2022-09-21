import Type from './Type'
import Validation, { IdentifierPath } from '../Validation'
import InvalidTypeErrorItem from '../errorReporting/InvalidTypeErrorItem'
import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'

export type Constructor<T> =
  | (new (...args: any[]) => T)
  | (abstract new (...args: any[]) => T)
export type ClassTypeOption<T> = () => Constructor<T>

export default class InstanceOfType<T> extends Type<T> {
  typeName = 'InstanceOfType'
  private _classType: ClassTypeOption<T>

  get classType(): Constructor<T> {
    return this._classType()
  }

  constructor(classType: ClassTypeOption<T>) {
    super()
    this._classType = classType
  }

  *errors(
    validation: Validation,
    path: IdentifierPath,
    input: any
  ): Iterable<RuntimeTypeErrorItem> {
    if (!(input instanceof this.classType)) {
      yield new InvalidTypeErrorItem(path, input, this)
    }
  }

  accepts(input: any): input is T {
    return input instanceof this.classType
  }

  get acceptsSomeCompositeTypes(): boolean {
    return true
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    return options?.formatForMustBe
      ? `an instance of ${this.classType.prototype.constructor.name}`
      : this.classType.prototype.constructor.name
  }
}
