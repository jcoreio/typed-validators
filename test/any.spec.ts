import * as t from '../src/'
import { expect } from 'chai'
import acceptsTypeTests from './acceptsTypeTests'

describe(`t.any`, function() {
  it(`accepts anything`, function() {
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

  acceptsTypeTests(t.any(), [
    t.any(),
    t.null(),
    t.undefined(),
    t.number(),
    t.string(),
    t.symbol(),
    t.object({ foo: t.number() }),
    t.record(t.string(), t.number()),
    t.array(t.number()),
    t.tuple(t.string()),
  ])
})
