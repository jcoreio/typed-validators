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

        Actual Value: true
      `
    )
    expect(() => t.number().assert('foo')).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a number

        Actual Value: "foo"
      `
    )
  })
  it(`.acceptsSomeCompositeTypes is false`, function() {
    expect(t.number().acceptsSomeCompositeTypes).to.be.false
  })
})

describe(`t.number(literal)`, function() {
  it(`requires value to be a boolean`, function() {
    expect(() => t.number('1' as any)).to.throw()
  })
  it(`accepts literal value`, function() {
    t.number(2).assert(2)
    t.number(15).assert(15)
  })
  it(`rejects everything else`, function() {
    expect(() => t.number(2).assert(3)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be 2

        Actual Value: 3
      `
    )
    expect(() => t.number(2).assert('foo')).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be 2

        Actual Value: "foo"
      `
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

        Actual Value: -0
      `
    )
    expect(() => t.number(-0).assert(0)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be -0

        Actual Value: 0
      `
    )
  })
})
