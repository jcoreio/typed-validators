import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import Type from './Type'

export default class AnyType<T = any> extends Type<T> {
  typeName = 'AnyType';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  *errors(): Iterable<RuntimeTypeErrorItem> {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accepts(input: any): input is T {
    return true
  }

  get acceptsSomeCompositeTypes(): boolean {
    return true
  }

  toString(): string {
    return 'any'
  }
}
