import PrimitiveLiteralType from './PrimitiveLiteralType'

export default class NullLiteralType extends PrimitiveLiteralType<null> {
  typeName = 'NullLiteralType'

  constructor() {
    super(null)
  }
}
