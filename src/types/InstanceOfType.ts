import Type from './Type'
import getErrorMessage from '../getErrorMessage'
import Validation, { ErrorTuple, IdentifierPath } from '../Validation'

export type ClassTypeOption<T> = () => { new (...args: any[]): T }

export default class InstanceOfType<T> extends Type<T> {
  typeName = 'InstanceOfType'
  private _classType: ClassTypeOption<T>

  get classType(): { new (...args: any[]): T } {
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
  ): Generator<ErrorTuple, void, void> {
    if (!(input instanceof this.classType)) {
      yield [
        path,
        getErrorMessage('ERR_EXPECT_INSTANCEOF', this.toString()),
        this,
      ]
    }
  }

  accepts(input: any): input is T {
    return input instanceof this.classType
  }

  protected acceptsSpecificType(type: Type<any>): boolean {
    return (
      type instanceof InstanceOfType &&
      Object.getPrototypeOf(type._classType instanceof this._classType)
    )
  }

  toString(): string {
    return this.classType.prototype.constructor.name
  }
}
