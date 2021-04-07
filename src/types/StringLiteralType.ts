import PrimitiveLiteralType from './PrimitiveLiteralType'

export default class StringLiteralType<
  T extends string
> extends PrimitiveLiteralType<T> {
  typeName = 'StringLiteralType'

  constructor(value: T) {
    super(value)
    if (typeof value !== 'string') {
      throw new Error(`value must be a string`)
    }
  }

  toString(): string {
    return JSON.stringify(this.value)
  }
}
