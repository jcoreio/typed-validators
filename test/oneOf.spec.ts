import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'
import typeOf from '../src/errorReporting/typeOf'

describe(`t.oneOf`, function() {
  const NumberOrString = t.oneOf(t.number(), t.string())

  const ObjectUnion = t.oneOf(
    t.object({ required: { foo: t.number() }, exact: false }),
    t.object({ required: { bar: t.string() }, exact: false })
  )
  it(`accepts valid values`, function() {
    for (const value of [1, 2, 'three', 'four']) {
      NumberOrString.assert(value)
      expect(NumberOrString.accepts(value)).to.be.true
    }
    for (const value of [
      { foo: 2 },
      { foo: 3 },
      { bar: 'hello' },
      { bar: 'world' },
    ]) {
      ObjectUnion.assert(value)
      expect(ObjectUnion.accepts(value)).to.be.true
    }
  })
  it(`rejects invalid values`, function() {
    for (const value of [true, false, null, undefined, [], {}]) {
      expect(() => NumberOrString.assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          Value must be one of: number | string
          
          Expected: number | string
          
          Actual Value: ${JSON.stringify(value, null, 2)}
          
          Actual Type: ${typeOf(value)}`
      )
      expect(NumberOrString.accepts(value)).to.be.false
    }
    for (const value of [
      true,
      false,
      null,
      undefined,
      [],
      {},
      { foo: '3' },
      { bar: 2 },
    ]) {
      expect(() => ObjectUnion.assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          Value must be one of: {
            foo: number
          } | {
            bar: string
          }
          
          Expected: {
            foo: number
          } | {
            bar: string
          }
          
          Actual Value: ${JSON.stringify(value, null, 2)}
          
          Actual Type: ${typeOf(value)}`
      )
      expect(ObjectUnion.accepts(value)).to.be.false
    }
  })
  it(`.acceptsSomeCompositeTypes`, function() {
    expect(t.oneOf(t.number(), t.string()).acceptsSomeCompositeTypes).to.be
      .false
    expect(
      t.oneOf(t.number(), t.object({ foo: t.number() }))
        .acceptsSomeCompositeTypes
    ).to.be.true
  })
})
