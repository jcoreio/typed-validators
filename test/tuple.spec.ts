import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'
import stringifyValue from '../src/errorReporting/stringifyValue'

describe(`t.tuple`, function() {
  const TheTuple = t.tuple(t.string(), t.number(), t.boolean())
  it(`accepts matching types`, function() {
    for (const value of [
      ['foo', 1, true],
      ['bar', 2, false],
    ]) {
      TheTuple.assert(value)
      expect(TheTuple.accepts(value)).to.be.true
    }
  })
  it(`rejects shorter arrays`, function() {
    for (const value of [['foo'], ['foo', 1]]) {
      expect(() => TheTuple.assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input.length must be 3, instead it is ${value.length}
          
          Actual Value: ${stringifyValue(value)}
        `
      )
      expect(TheTuple.accepts(value)).to.be.false
    }
  })
  it(`rejects longer arrays`, function() {
    for (const value of [['foo', 1, false, null]]) {
      expect(() => TheTuple.assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input.length must be 3, instead it is 4

          Actual Value: ${stringifyValue(value)}
        `
      )
      expect(TheTuple.accepts(value)).to.be.false
    }
  })
  it(`rejects elements of the wrong type`, function() {
    const value = [1, 2, null]
    expect(() => TheTuple.assert(value)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input[0] must be a string
        
        Actual Value: 1
        
        -------------------------------------------------
        
        input[2] must be a boolean
        
        Actual Value: null
      `
    )
  })
  it(`.acceptsSomeCompositeTypes is true`, function() {
    expect(t.tuple(t.number()).acceptsSomeCompositeTypes).to.be.true
  })
})
