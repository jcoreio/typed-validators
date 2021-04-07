import PrimitiveLiteralType from './PrimitiveLiteralType'

export default class SymbolLiteralType<
  T extends symbol
> extends PrimitiveLiteralType<T> {
  typeName = 'SymbolLiteralType'

  constructor(value: T) {
    super(value)
    if (typeof value !== 'symbol') {
      throw new Error(`value must be symbol`)
    }
  }
}
