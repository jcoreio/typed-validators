import PrimitiveLiteralType from './PrimitiveLiteralType'

export default class BooleanLiteralType<
  T extends boolean
> extends PrimitiveLiteralType<T> {
  typeName = 'BooleanLiteralType'

  constructor(value: T) {
    super(value)
  }
}
