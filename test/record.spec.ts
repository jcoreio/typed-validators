import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.record`, function () {
  it(`requires key to be instance of Type`, function () {
    expect(() => t.record('hello' as any, t.number())).to.throw()
  })
  it(`requires value to be instance of Type`, function () {
    expect(() => t.record(t.string('a'), 2 as any)).to.throw()
  })
  const Numbers = t.record(
    t.oneOf(t.string('a'), t.string('b'), t.string('c')),
    t.number()
  )
  it(`accepts matching records`, function () {
    for (const value of [{ a: 1 }, { a: 1, b: 2 }, { a: 1, b: 2, c: 3 }]) {
      Numbers.assert(value)
      expect(Numbers.accepts(value)).to.be.true
    }
  })
  it(`rejects keys that don't match`, function () {
    expect(() => Numbers.assert({ a: 1, d: 3 })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input has key of invalid type: d

        Each key must be one of "a" | "b" | "c"
        
        Actual Value: {
          a: 1,
          d: 3,
        }
      `
    )
  })
  it(`rejects values that don't match`, function () {
    expect(() => Numbers.assert({ a: 'one' })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input.a must be a number
        
        Actual Value: "one"
      `
    )
  })
  it(`rejects everything else`, function () {
    for (const value of [true, 'foo', null, undefined, 2, []]) {
      expect(Numbers.accepts(value)).to.be.false
      expect(() => Numbers.assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be of type Record<"a" | "b" | "c", number>

          Actual Value: ${JSON.stringify(value)}
        `
      )
    }
  })
  it(`circular references`, function () {
    const RecursiveType = t.alias(
      'RecursiveType',
      t.record(t.string(), t.array(t.ref(() => RecursiveType)))
    )
    const NonRecursiveType = t.record(
      t.string(),
      t.array(t.record(t.string(), t.array(t.object({}))))
    )

    const value: any = { foo: [], bar: [] }
    value.foo.push(value)
    value.bar.push(value)

    RecursiveType.assert(value)
    expect(RecursiveType.accepts(value)).to.be.true

    expect(() => NonRecursiveType.assert(value)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input.foo[0].foo[0] has unknown property: foo
        
        Actual Value: <ref *1> {
          foo: [
            <ref *1>,
          ],
          bar: [
            <ref *1>,
          ],
        }
        
        -------------------------------------------------
        
        input.foo[0].foo[0] has unknown property: bar
        
        Actual Value: <ref *1> {
          foo: [
            <ref *1>,
          ],
          bar: [
            <ref *1>,
          ],
        }
        
        -------------------------------------------------
        
        input.foo[0].bar[0] has unknown property: foo
        
        Actual Value: <ref *1> {
          foo: [
            <ref *1>,
          ],
          bar: [
            <ref *1>,
          ],
        }
        
        -------------------------------------------------
        
        input.foo[0].bar[0] has unknown property: bar
        
        Actual Value: <ref *1> {
          foo: [
            <ref *1>,
          ],
          bar: [
            <ref *1>,
          ],
        }
      `
    )
    expect(NonRecursiveType.accepts(value)).to.be.false
  })
  it(`.acceptsSomeCompositeTypes is false`, function () {
    expect(t.record(t.string(), t.number()).acceptsSomeCompositeTypes).to.be
      .true
  })
})
