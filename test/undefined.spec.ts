import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.undefined`, function () {
  it(`accepts undefined`, function () {
    t.undefined().assert(undefined)
    expect(t.undefined().accepts(undefined)).to.be.true
  })
  it(`rejects everything else`, function () {
    for (const value of [true, 'foo', null, 2, [], {}]) {
      expect(t.undefined().accepts(value)).to.be.false
      expect(() => t.undefined().assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be undefined

          Actual Value: ${JSON.stringify(value)}
        `
      )
    }
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.undefined().acceptsSomeCompositeTypes).to.be.false
  })
})
