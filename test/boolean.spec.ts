import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.boolean`, function () {
  it(`accepts booleans`, function () {
    t.boolean().assert(true)
    t.boolean().assert(false)
    expect(t.boolean().accepts(true)).to.be.true
    expect(t.boolean().accepts(false)).to.be.true
  })
  it(`rejects everything else`, function () {
    expect(t.boolean().accepts(2)).to.be.false
    expect(() => t.boolean().assert(2)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a boolean

        Actual Value: 2
      `
    )
    expect(t.boolean().accepts('foo')).to.be.false
    expect(() => t.boolean().assert('foo')).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a boolean

        Actual Value: "foo"
      `
    )
    expect(t.boolean().accepts([])).to.be.false
    expect(() => t.boolean().assert([])).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a boolean

        Actual Value: []
      `
    )
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.boolean().acceptsSomeCompositeTypes).to.be.false
  })
})

describe(`t.boolean(literal)`, function () {
  it(`requires value to be a boolean`, function () {
    expect(() => t.boolean(2 as any)).to.throw()
  })
  it(`accepts literal value`, function () {
    t.boolean(true).assert(true)
    t.boolean(false).assert(false)
    expect(t.boolean(true).accepts(true)).to.be.true
    expect(t.boolean(false).accepts(false)).to.be.true
  })
  it(`rejects everything else`, function () {
    expect(t.boolean(true).accepts(false)).to.be.false
    expect(t.boolean(false).accepts(true)).to.be.false
    expect(t.boolean(false).accepts(2)).to.be.false
    expect(t.boolean(false).accepts('foo')).to.be.false
    expect(t.boolean(false).accepts([])).to.be.false
    expect(() => t.boolean(true).assert(false)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be true

        Actual Value: false
      `
    )
    expect(() => t.boolean(false).assert(true)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be false

        Actual Value: true
      `
    )
    expect(() => t.boolean(true).assert(2)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be true

        Actual Value: 2
      `
    )
    expect(() => t.boolean(false).assert('foo')).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be false

        Actual Value: "foo"
      `
    )
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.boolean(true).acceptsSomeCompositeTypes).to.be.false
  })
})
