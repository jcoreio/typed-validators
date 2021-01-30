import PrimitiveLiteralType from './PrimitiveLiteralType'

export default class SymbolLiteralType<
  T extends symbol
> extends PrimitiveLiteralType<T> {
  typeName = 'SymbolLiteralType'

  constructor(value: T) {
    super(value)
  }
}
