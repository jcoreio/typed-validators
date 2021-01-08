import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.mergeInexact`, function() {
  const BarAlias = t.alias('Bar', t.object({ bar: t.string() }))
  const Merged = t.mergeInexact(
    t.object({ foo: t.number() }),
    t.ref(() => BarAlias)
  )
  it(`throws if any of the given types aren't objects`, function() {
    const NumberAlias = t.alias('Number', t.number())
    expect(() =>
      t
        .mergeInexact(
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
      { foo: 2, bar: 'hello', baz: 'qux' },
    ]) {
      Merged.assert(value)
      expect(Merged.accepts(value)).to.be.true
    }
  })
  it(`rejects invalid values`, function() {
    expect(() => Merged.assert({ foo: 3 })).to.throw(
      t.RuntimeTypeError,
      dedent`
          Value must have property: bar
          
          Expected: {
            foo: number
            bar: string
          }
          
          Actual Value: {
            "foo": 3
          }
          
          Actual Type: {
            foo: number
          }`
    )
    expect(Merged.accepts({ foo: 3 })).to.be.false
    expect(() => Merged.assert({ bar: 'hello' })).to.throw(
      t.RuntimeTypeError,
      dedent`
          Value must have property: foo
          
          Expected: {
            foo: number
            bar: string
          }
          
          Actual Value: {
            "bar": "hello"
          }
          
          Actual Type: {
            bar: string
          }`
    )
    expect(Merged.accepts({ bar: 'hello' })).to.be.false
  })
})
