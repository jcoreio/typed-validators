import * as t from '../src/'
import { expect } from 'chai'

describe(`t.any`, function () {
  it(`toString()`, function () {
    expect(t.any().toString()).to.equal('any')
  })
  it(`accepts anything`, function () {
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
      t.any().assert(value)
      expect(t.any().accepts(value)).to.be.true
      expect([
        ...t.any().errors(new t.Validation(value), [], value),
      ]).to.deep.equal([])
    }
  })
  it(`.acceptsSomeCompositeTypes is true`, function () {
    expect(t.any().acceptsSomeCompositeTypes).to.be.true
  })
})
