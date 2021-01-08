import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'
import acceptsTypeTests from './acceptsTypeTests'
import notAcceptsTypeTests from './notAcceptsTypeTests'

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
    expect(() => ObjectIntersection.assert({ foo: 3 })).to.throw(
      t.RuntimeTypeError,
      dedent`
          Value must have property: bar
          
          Expected: {
            bar: string
          }
          
          Actual Value: {
            "foo": 3
          }
          
          Actual Type: {
            foo: number
          }`
    )
    expect(ObjectIntersection.accepts({ foo: 3 })).to.be.false
    expect(() => ObjectIntersection.assert({ bar: 'hello' })).to.throw(
      t.RuntimeTypeError,
      dedent`
          Value must have property: foo
          
          Expected: {
            foo: number
          }
          
          Actual Value: {
            "bar": "hello"
          }
          
          Actual Type: {
            bar: string
          }`
    )
    expect(ObjectIntersection.accepts({ bar: 'hello' })).to.be.false
  })

  acceptsTypeTests(
    ObjectIntersection,
    t.object({ foo: t.number(), bar: t.string() })
  )

  notAcceptsTypeTests(ObjectIntersection, [
    t.object({ foo: t.number() }),
    t.object({ bar: t.string() }),
    t.object({ foo: t.string(), bar: t.string() }),
    t.object({ foo: t.number(), bar: t.number() }),
  ])
})
