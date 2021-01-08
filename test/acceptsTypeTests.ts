import { Type } from '../src/index'
import { expect } from 'chai'
import { describe, it } from 'mocha'

export default function acceptsTypeTests(
  type: Type<any>,
  expectAccepts: Type<any> | Type<any>[]
): void {
  describe(type.toString(), function() {
    for (const other of Array.isArray(expectAccepts)
      ? expectAccepts
      : [expectAccepts]) {
      it(`accepts type ${other.toString()}`, function() {
        expect(type.acceptsType(other)).to.be.true
      })
    }
  })
}
