import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

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
          input must be one of number | string
          
          Actual Value: ${JSON.stringify(value, null, 2)}
        `
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
          input must be one of:

            {
              foo: number
            } | {
              bar: string
            }
          
          Actual Value: ${JSON.stringify(value, null, 2)}
        `
      )
      expect(ObjectUnion.accepts(value)).to.be.false
    }
  })
  it(`has good error messages for {foo: string} | null on non-null input`, function() {
    const MaybeFoo = t.oneOf(t.object({ foo: t.string() }), t.null())
    const value = { foo: 1 }
    expect(() => MaybeFoo.assert(value, undefined, ['value'])).to.throw(
      t.RuntimeTypeError,
      dedent`
        value.foo must be a string

        Actual Value: 1
      `
    )
    expect(() => MaybeFoo.assert(1, undefined, ['value'])).to.throw(
      t.RuntimeTypeError,
      dedent`
        value must be one of:

          {
            foo: string
          } | null

        Actual Value: 1
      `
    )
  })
  it(`has good error messages for {foo: string}[] | null on non-null input`, function() {
    const MaybeFooArray = t.oneOf(
      t.array(t.object({ foo: t.string() })),
      t.null()
    )
    expect(() =>
      MaybeFooArray.assert([{ foo: 1 }], undefined, ['value'])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        value[0].foo must be a string

        Actual Value: 1
      `
    )
    expect(() =>
      MaybeFooArray.assert([{ bar: 'hello' }], undefined, ['value'])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        value[0] is missing required property foo, which must be a string

        Actual Value: {
          "bar": "hello"
        }

        -------------------------------------------------
        
        value[0] has unknown property: bar
        
        Actual Value: {
          "bar": "hello"
        }
      `
    )
    expect(() => MaybeFooArray.assert(1, undefined, ['value'])).to.throw(
      t.RuntimeTypeError,
      dedent`
        value must be one of:

          Array<{
            foo: string
          }> | null
        
        Actual Value: 1
      `
    )
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
