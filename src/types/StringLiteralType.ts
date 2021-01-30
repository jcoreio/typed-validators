import PrimitiveLiteralType from './PrimitiveLiteralType'

export default class StringLiteralType<
  T extends string
> extends PrimitiveLiteralType<T> {
  typeName = 'StringLiteralType'

  constructor(value: T) {
    super(value)
  }

  toString(): string {
    return JSON.stringify(this.value)
  }
}
