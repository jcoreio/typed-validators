import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.number`, function() {
  it(`accepts numbers`, function() {
    t.number().assert(5)
    t.number().assert(-2)
  })
  it(`rejects everything else`, function() {
    expect(() => t.number().assert(true)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a number

        Expected: number

        Actual Value: true

        Actual Type: boolean`
    )
    expect(() => t.number().assert('foo')).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a number

        Expected: number

        Actual Value: "foo"

        Actual Type: string`
    )
  })
  it(`.acceptsSomeCompositeTypes is false`, function() {
    expect(t.number().acceptsSomeCompositeTypes).to.be.false
  })
})

describe(`t.number(literal)`, function() {
  it(`accepts literal value`, function() {
    t.number(2).assert(2)
    t.number(15).assert(15)
  })
  it(`rejects everything else`, function() {
    expect(() => t.number(2).assert(3)).to.throw(
      t.RuntimeTypeError,
      dedent`
      input must be 2

      Expected: 2

      Actual Value: 3

      Actual Type: number`
    )
    expect(() => t.number(2).assert('foo')).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be 2

        Expected: 2

        Actual Value: "foo"

        Actual Type: string`
    )
  })
  it(`special cases`, function() {
    for (const value of [NaN, -Infinity, -0, +0, Infinity]) {
      t.number(value).assert(value)
    }
    expect(() => t.number(0).assert(-0)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be 0

        Expected: 0

        Actual Value: -0

        Actual Type: number
      `
    )
    expect(() => t.number(-0).assert(0)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be -0

        Expected: -0

        Actual Value: 0

        Actual Type: number
      `
    )
  })
})
