import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.merge`, function() {
  const BarAlias = t.alias('Bar', t.object({ bar: t.string() }))
  const Merged = t.merge(
    t.object({ foo: t.number() }),
    t.ref(() => BarAlias)
  )
  it(`throws if any of the given types aren't objects`, function() {
    const NumberAlias = t.alias('Number', t.number())
    expect(() =>
      t
        .merge(
          t.object({ foo: t.number() }),
          t.ref(() => NumberAlias)
        )
        .assert({ foo: 3 })
    ).to.throw(
      `a merged type didn't resolve to an ObjectType: Number (resolved to number)`
    )
  })
  it(`accepts valid values`, function() {
    for (const value of [
      { foo: 2, bar: 'hello' },
      { foo: -5, bar: 'world' },
    ]) {
      Merged.assert(value)
      expect(Merged.accepts(value)).to.be.true
    }
  })
  it(`rejects invalid values`, function() {
    expect(() => Merged.assert({ foo: 3 })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input is missing required property bar, which must be a string
        
        Actual Value: {
          "foo": 3
        }
      `
    )
    expect(Merged.accepts({ foo: 3 })).to.be.false
    expect(() => Merged.assert({ bar: 'hello' })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input is missing required property foo, which must be a number
        
        Actual Value: {
          "bar": "hello"
        }
      `
    )
    expect(Merged.accepts({ bar: 'hello' })).to.be.false
    expect(() => Merged.assert({ foo: 1, bar: 'a', baz: 'qux' })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input has unknown property: baz
        
        Actual Value: {
          "foo": 1,
          "bar": "a",
          "baz": "qux"
        }
      `
    )
    expect(Merged.accepts({ foo: 1, bar: 'a', baz: 'qux' })).to.be.false
  })
  it(`.acceptsSomeCompositeTypes is true`, function() {
    expect(Merged.acceptsSomeCompositeTypes).to.be.true
  })
})
