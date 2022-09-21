import * as t from '../src'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.nullish`, function () {
  for (const value of [null, undefined]) {
    it(`accepts ${value}`, function () {
      t.nullish().assert(value)
      expect(t.nullish().accepts(value)).to.be.true
    })
  }
  it(`rejects everything else`, function () {
    for (const value of [true, 'foo', 1, [], {}]) {
      expect(t.nullish().accepts(value)).to.be.false
      expect(() => t.nullish().assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be one of null | undefined

          Actual Value: ${JSON.stringify(value)}
        `
      )
    }
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.nullish().acceptsSomeCompositeTypes).to.be.false
  })
})
