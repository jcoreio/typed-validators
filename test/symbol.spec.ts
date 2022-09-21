import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.symbol`, function () {
  it(`accepts symbols`, function () {
    t.symbol().assert(Symbol('foo'))
    t.symbol().assert(Symbol())
    expect(t.symbol().accepts(Symbol('foo'))).to.be.true
  })
  it(`rejects everything else`, function () {
    expect(t.symbol().accepts(true)).to.be.false
    expect(() => t.symbol().assert(true)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a symbol

        Actual Value: true
      `
    )
    expect(t.symbol().accepts(2)).to.be.false
    expect(() => t.symbol().assert(2)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be a symbol

        Actual Value: 2
      `
    )
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.symbol().acceptsSomeCompositeTypes).to.be.false
  })
})

describe(`t.symbol(literal)`, function () {
  it(`requires value to be a string`, function () {
    expect(() => t.symbol('hello')).to.throw()
  })
  const foo = Symbol('foo')
  const bar = Symbol('bar')
  it(`accepts literal value`, function () {
    t.symbol(foo).assert(foo)
    t.symbol(bar).assert(bar)
  })
  it(`rejects everything else`, function () {
    expect(() => t.symbol(foo).assert(bar)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be Symbol(foo)

        Actual Value: Symbol(bar)
      `
    )
    expect(() => t.symbol(foo).assert(3)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be Symbol(foo)
        
        Actual Value: 3
      `
    )
  })
})
