import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.allOf`, function() {
  const ObjectIntersection = t.allOf(
    t.object({ required: { foo: t.number() }, exact: false }),
    t.object({ required: { bar: t.string() }, exact: false })
  )
  it(`accepts valid values`, function() {
    for (const value of [
      { foo: 2, bar: 'hello' },
      { foo: -5, bar: 'world' },
    ]) {
      ObjectIntersection.assert(value)
      expect(ObjectIntersection.accepts(value)).to.be.true
    }
  })
  it(`rejects invalid values`, function() {
    expect(() =>
      ObjectIntersection.assert({ foo: 3 }, undefined, ['value'])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
          value is missing required property: bar
          
          Expected: bar: string
          
          Actual Value: undefined
          
          Actual Type: undefined
        `
    )
    expect(ObjectIntersection.accepts({ foo: 3 })).to.be.false
    expect(() =>
      ObjectIntersection.assert({ bar: 'hello' }, undefined, ['value'])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        value is missing required property: foo

        Expected: foo: number
        
        Actual Value: undefined
        
        Actual Type: undefined
      `
    )
    expect(ObjectIntersection.accepts({ bar: 'hello' })).to.be.false
  })
  it(`.acceptsSomeCompositeTypes`, function() {
    expect(t.allOf(t.string('foo'), t.string()).acceptsSomeCompositeTypes).to.be
      .false
    expect(
      t.allOf(
        t.object({ foo: t.string() }),
        t.object({ foo: t.oneOf(t.string(), t.number()) })
      ).acceptsSomeCompositeTypes
    ).to.be.true
  })
})
