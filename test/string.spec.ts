import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.string`, function () {
  it(`accepts strings`, function () {
    t.string().assert('foo')
    t.string().assert('')
  })
  it(`rejects everything else`, function () {
    expect(() => t.string().assert(true)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a string

        Actual Value: true
      `
    )
    expect(() => t.string().assert(2)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a string

        Actual Value: 2
      `
    )
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.string().acceptsSomeCompositeTypes).to.be.false
  })
})

describe(`t.string(literal)`, function () {
  it(`requires value to be a string`, function () {
    expect(() => t.string(1 as any)).to.throw()
  })
  it(`accepts literal value`, function () {
    t.string('foo').assert('foo')
    t.string('').assert('')
  })
  it(`rejects everything else`, function () {
    expect(() => t.string('foo').assert('bar')).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be "foo"

        Actual Value: "bar"
      `
    )
    expect(() => t.string('foo').assert(3)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be "foo"

        Actual Value: 3
      `
    )
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.string('foo').acceptsSomeCompositeTypes).to.be.false
  })
})
