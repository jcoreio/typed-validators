import Type from './Type'

import { ErrorTuple } from '../Validation'

export default class AnyType extends Type<any> {
  typeName = 'AnyType';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  *errors(): Generator<ErrorTuple, void, void> {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accepts(input: any): input is any {
    return true
  }

  toString(): string {
    return 'any'
  }
}
