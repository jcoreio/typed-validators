import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.allOf`, function() {
  const ObjectIntersection = t.allOf(
    t.object({ required: { foo: t.number() } }),
    t.object({ required: { bar: t.string() } })
  )
  const InexactObjectIntersection = t.allOf(
    t.object({ required: { foo: t.number() } }),
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
    for (const value of [
      { foo: 2, bar: 'hello', qux: 1 },
      { foo: -5, bar: 'world', qux: 2 },
    ]) {
      InexactObjectIntersection.assert(value)
      expect(InexactObjectIntersection.accepts(value)).to.be.true
    }
  })
  it(`rejects invalid values`, function() {
    expect(() =>
      ObjectIntersection.assert({ foo: 3 }, undefined, ['value'])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
          value is missing required property bar, which must be a string
          
          Actual Value: {
            foo: 3,
          }
        `
    )
    expect(ObjectIntersection.accepts({ foo: 3 })).to.be.false
    expect(() =>
      ObjectIntersection.assert({ bar: 'hello' }, undefined, ['value'])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        value is missing required property foo, which must be a number
        
        Actual Value: {
          bar: "hello",
        }
      `
    )
    expect(ObjectIntersection.accepts({ bar: 'hello' })).to.be.false

    expect(() =>
      ObjectIntersection.assert({ foo: 3, bar: 'hello', qux: 1 }, undefined, [
        'value',
      ])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        value has unknown property: qux
        
        Actual Value: {
          foo: 3,
          bar: "hello",
          qux: 1,
        }
      `
    )
    expect(ObjectIntersection.accepts({ foo: 3, bar: 'hello', qux: 1 })).to.be
      .false
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
