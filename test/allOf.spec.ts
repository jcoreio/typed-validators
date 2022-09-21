import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'
import stringifyValue from '../src/errorReporting/stringifyValue'

describe(`t.allOf`, function () {
  it(`requires all types to be instance of Type`, function () {
    expect(() => t.oneOf(t.null(), 2 as any)).to.throw()
  })
  describe(`intersection of unions`, function () {
    const NumberOrNull = t.allOf(
      t.oneOf(t.number(), t.string(), t.null()),
      t.oneOf(
        t.number(),
        t.instanceOf(() => Date),
        t.null()
      )
    )
    it(`.toString()`, function () {
      expect(NumberOrNull.toString()).to.equal(
        '(number | string | null) & (number | Date | null)'
      )
      expect(NumberOrNull.toString({ formatForMustBe: true })).to.equal(
        'of type (number | string | null) & (number | Date | null)'
      )
      expect(
        t.allOf(t.string(), t.oneOf(t.string(), t.null())).toString()
      ).to.equal('string & (string | null)')
    })
    it(`accepts valid values`, function () {
      for (const value of [1, 2, null]) {
        NumberOrNull.assert(value)
        expect(NumberOrNull.accepts(value)).to.be.true
      }
    })
    it(`rejects invalid values`, function () {
      for (const value of [undefined, {}]) {
        expect(() => NumberOrNull.assert(value)).to.throw(
          t.RuntimeTypeError,
          dedent`
            input must be one of number | string | null
            
            Actual Value: ${stringifyValue(value)}
            
            -------------------------------------------------
            
            input must be one of number | Date | null
            
            Actual Value: ${stringifyValue(value)}
          `
        )
        expect(NumberOrNull.accepts(value)).to.be.false
      }

      expect(() => NumberOrNull.assert('foo')).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be one of number | Date | null
          
          Actual Value: ${stringifyValue('foo')}
        `
      )
      expect(NumberOrNull.accepts('foo')).to.be.false

      expect(() => NumberOrNull.assert(new Date())).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be one of number | string | null
          
          Actual Value: Date {}
        `
      )
      expect(NumberOrNull.accepts(new Date())).to.be.false
    })
  })
  describe(`object intersections`, function () {
    const ObjectIntersection = t.allOf(
      t.object({ required: { foo: t.number() } }),
      t.object({ required: { bar: t.string() } })
    )
    const InexactObjectIntersection = t.allOf(
      t.object({ required: { foo: t.number() } }),
      t.object({ required: { bar: t.string() }, exact: false })
    )
    it(`accepts valid values`, function () {
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
    it(`rejects invalid values`, function () {
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
  })
  it(`.acceptsSomeCompositeTypes`, function () {
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
