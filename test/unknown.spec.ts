import * as t from '../src/'
import { expect } from 'chai'

describe(`t.unknown`, function () {
  it(`toString()`, function () {
    expect(t.unknown().toString()).to.equal('unknown')
  })
  it(`accepts unknownthing`, function () {
    for (const value of [
      null,
      undefined,
      true,
      2,
      'foo',
      Symbol('foo'),
      { foo: 'bar' },
      [],
    ]) {
      t.unknown().assert(value)
      expect(t.unknown().accepts(value)).to.be.true
      expect([
        ...t.unknown().errors(new t.Validation(value), [], value),
      ]).to.deep.equal([])
    }
  })
  it(`.acceptsSomeCompositeTypes is true`, function () {
    expect(t.unknown().acceptsSomeCompositeTypes).to.be.true
  })
})
