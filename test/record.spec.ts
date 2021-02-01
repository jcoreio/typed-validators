import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.record`, function() {
  const Numbers = t.record(t.string(), t.number())
  it(`accepts matching records`, function() {
    for (const value of [{ a: 1 }, { a: 1, b: 2 }]) {
      Numbers.assert(value)
      expect(Numbers.accepts(value)).to.be.true
    }
  })
  it(`rejects values that don't match`, function() {
    const value = { a: 'one' }
    expect(() => Numbers.assert(value, '', ['value'])).to.throw(
      t.RuntimeTypeError,
      dedent`
        value.a must be a number
        
        Actual Value: "one"
      `
    )
  })
  it(`rejects everything else`, function() {
    for (const value of [true, 'foo', null, undefined, 2, []]) {
      expect(Numbers.accepts(value)).to.be.false
      expect(() => Numbers.assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be of type Record<string, number>

          Actual Value: ${JSON.stringify(value)}
        `
      )
    }
  })
  it(`.acceptsSomeCompositeTypes is false`, function() {
    expect(t.record(t.string(), t.number()).acceptsSomeCompositeTypes).to.be
      .true
  })
})
