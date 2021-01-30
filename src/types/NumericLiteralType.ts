import PrimitiveLiteralType from './PrimitiveLiteralType'

export default class NumericLiteralType<
  T extends number
> extends PrimitiveLiteralType<T> {
  typeName = 'NumericLiteralType'

  constructor(value: T) {
    super(value)
  }

  toString(): string {
    return Object.is(this.value, -0) ? '-0' : String(this.value)
  }
}
