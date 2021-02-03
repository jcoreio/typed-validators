import AnyType from './AnyType'

export default class UnknownType extends AnyType<unknown> {
  typeName = 'UnknownType'

  toString(): string {
    return 'unknown'
  }
}
