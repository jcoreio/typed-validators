import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.null`, function () {
  it(`accepts null`, function () {
    t.null().assert(null)
    expect(t.null().accepts(null)).to.be.true
  })
  it(`rejects everything else`, function () {
    for (const value of [true, 'foo', undefined, 2, [], {}]) {
      expect(t.null().accepts(value)).to.be.false
      expect(() => t.null().assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be null

          Actual Value: ${JSON.stringify(value)}
        `
      )
    }
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.null().acceptsSomeCompositeTypes).to.be.false
  })
})
