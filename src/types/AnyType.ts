import RuntimeTypeErrorItem from '../errorReporting/RuntimeTypeErrorItem'
import Type from './Type'

export default class AnyType extends Type<any> {
  typeName = 'AnyType';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  *errors(): Iterable<RuntimeTypeErrorItem> {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accepts(input: any): input is any {
    return true
  }

  get acceptsSomeCompositeTypes(): boolean {
    return true
  }

  toString(options?: { formatForMustBe?: boolean }): string {
    return options?.formatForMustBe ? 'any type' : 'any'
  }
}
