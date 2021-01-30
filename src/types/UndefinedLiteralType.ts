import PrimitiveLiteralType from './PrimitiveLiteralType'

export default class UndefinedLiteralType extends PrimitiveLiteralType<
  undefined
> {
  typeName = 'UndefinedLiteralType'

  constructor() {
    super(undefined)
  }
}
