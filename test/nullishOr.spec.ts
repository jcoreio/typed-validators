import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.nullishOr(t.number())`, function () {
  for (const value of [null, undefined, 1]) {
    it(`accepts ${value}`, function () {
      t.nullishOr(t.number()).assert(value)
      expect(t.nullishOr(t.number()).accepts(value)).to.be.true
    })
  }
  it(`rejects everything else`, function () {
    for (const value of [true, 'foo', [], {}]) {
      expect(t.nullishOr(t.number()).accepts(value)).to.be.false
      expect(() => t.nullishOr(t.number()).assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be one of number | null | undefined

          Actual Value: ${JSON.stringify(value)}
        `
      )
    }
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.nullishOr(t.number()).acceptsSomeCompositeTypes).to.be.false
  })
})
