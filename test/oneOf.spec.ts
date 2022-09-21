import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'
import stringifyValue from '../src/errorReporting/stringifyValue'

describe(`t.oneOf`, function () {
  it(`requires types to be instance of Type`, function () {
    expect(() => t.oneOf(t.object({ foo: t.number() }), 2 as any)).to.throw()
  })
  const NumberOrString = t.oneOf(t.number(), t.string())

  const ObjectUnion = t.oneOf(
    t.object({ required: { foo: t.number() }, exact: false }),
    t.object({ required: { bar: t.string() }, exact: false })
  )
  it(`.toString()`, function () {
    expect(
      t
        .oneOf(
          t.allOf(t.string(), t.number()),
          t.null(),
          t.allOf(t.number(), t.number(2))
        )
        .toString()
    ).to.equal('(string & number) | null | (number & 2)')
  })
  it(`accepts valid values`, function () {
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
  it(`rejects invalid values`, function () {
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
          
          Actual Value: ${stringifyValue(value)}
        `
      )
      expect(ObjectUnion.accepts(value)).to.be.false
    }
  })
  it(`has good error messages for {foo: string} | null on non-null input`, function () {
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
  it(`has good error messages for {foo: string}[] | null on non-null input`, function () {
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
          bar: "hello",
        }

        -------------------------------------------------
        
        value[0] has unknown property: bar
        
        Actual Value: {
          bar: "hello",
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
  it(`has good error messages for union of objects with type property`, function () {
    const TestType = t.oneOf(
      t.object({
        required: {
          Foo: t.number(1),
          Host: t.string(),
          User: t.string(),
          Name: t.string(),
          Type: t.string('External'),
          Password: t.string(),
        },

        optional: {
          Port: t.oneOf(t.string(), t.null()),
          RootDBName: t.oneOf(t.string(), t.null()),
          SecurityGroupId: t.oneOf(t.string(), t.null()),
        },
      }),
      t.object({
        Type: t.string('RDS'),
        MasterUserPassword: t.string(),
        AvailabilityZone: t.string(),
      }),
      t.object({
        Type: t.string('Historian'),
      }),
      t.string('Test'),
      t.null(),
      t.undefined()
    )

    expect(() => TestType.assert({ foo: 'bar' })).throw(
      t.RuntimeTypeError,
      dedent`
        input must be one of:
        
          {
            Foo: 1
            Host: string
            User: string
            Name: string
            Type: "External"
            Password: string
            Port?: string | null
            RootDBName?: string | null
            SecurityGroupId?: string | null
          } | {
            Type: "RDS"
            MasterUserPassword: string
            AvailabilityZone: string
          } | {
            Type: "Historian"
          } | "Test" | null | undefined
        
        Actual Value: {
          foo: "bar",
        }
      `
    )

    expect(() =>
      TestType.assert({ Type: 'RDS', AvailabilityZone: 1 })
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        input is missing required property MasterUserPassword, which must be a string

        Actual Value: {
          Type: "RDS",
          AvailabilityZone: 1,
        }

        -------------------------------------------------

        input.AvailabilityZone must be a string

        Actual Value: 1
      `
    )
  })
  it(`.acceptsSomeCompositeTypes`, function () {
    expect(t.oneOf(t.number(), t.string()).acceptsSomeCompositeTypes).to.be
      .false
    expect(
      t.oneOf(t.number(), t.object({ foo: t.number() }))
        .acceptsSomeCompositeTypes
    ).to.be.true
  })
})
