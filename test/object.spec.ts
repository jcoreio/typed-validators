import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.object`, function () {
  it(`requires values to be instance of Type`, function () {
    expect(() => t.object({ name: 2 as any })).to.throw()
  })

  const Person = t.object({
    required: {
      name: t.string(),
    },
    optional: {
      age: t.nullOr(t.number()),
    },
  })
  const nameSymbol = Symbol('name')
  const TypeWithSymbol = t.object({
    required: {
      [nameSymbol]: t.string(),
    },
    optional: {
      age: t.nullOr(t.number()),
    },
  })
  it(`accepts matching object`, function () {
    for (const value of [
      { name: 'Jimbo' },
      { name: 'Jimbo', age: null },
      { name: 'Jimbo', age: 20 },
    ]) {
      expect(Person.accepts(value)).to.be.true
      Person.assert(value)
    }

    for (const value of [
      { [nameSymbol]: 'Jimbo' },
      { [nameSymbol]: 'Jimbo', age: null },
      { [nameSymbol]: 'Jimbo', age: 20 },
    ]) {
      expect(TypeWithSymbol.accepts(value)).to.be.true
      TypeWithSymbol.assert(value)
    }
  })
  it(`rejects missing properties`, function () {
    expect(Person.accepts({ age: 20 })).to.be.false
    expect(() => Person.assert({ age: 20 })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input is missing required property name, which must be a string

        Actual Value: {
          age: 20,
        }
      `
    )
    expect(TypeWithSymbol.accepts({ age: 20 })).to.be.false
    expect(() => TypeWithSymbol.assert({ age: 20 })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input is missing required property [Symbol(name)], which must be a string

        Actual Value: {
          age: 20,
        }
      `
    )
  })
  it(`rejects missing properties (key formatting)`, function () {
    expect(t.object({ 'first-name': t.string() }).accepts({ 'first-name': 0 }))
      .to.be.false
    expect(() =>
      t.object({ 'first-name': t.string() }).assert({ age: 20 })
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        input is missing required property "first-name", which must be a string

        Actual Value: {
          age: 20,
        }
      `
    )
  })
  it(`validates properties`, function () {
    const value = { name: 1 }
    expect(Person.accepts(value)).to.be.false
    expect(() => Person.assert(value, undefined, ['value'])).to.throw(
      t.RuntimeTypeError,
      dedent`
        value.name must be a string

        Actual Value: 1
      `
    )
  })
  it(`deep validation`, function () {
    const People = t.array(Person)
    const values = [{ name: 1 }, { name: 'Jimbo', age: 'old' }]
    expect(() => People.assert(values, undefined, ['values'])).to.throw(
      t.RuntimeTypeError,
      dedent`
        values[0].name must be a string
        
        Actual Value: 1
        
        -------------------------------------------------
        
        values[1].age must be one of number | null
        
        Actual Value: "old"
      `
    )
  })
  it(`rejects extraneous properties`, function () {
    const value = { name: 'Jimbo', powerLevel: 9001 }
    expect(Person.accepts(value)).to.be.false
    expect(() => Person.assert(value)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input has unknown property: powerLevel

        Actual Value: {
          name: "Jimbo",
          powerLevel: 9001,
        }
      `
    )

    const value2 = { [nameSymbol]: 'Jimbo', powerLevel: 9001 }
    expect(TypeWithSymbol.accepts(value2)).to.be.false
    expect(() => TypeWithSymbol.assert(value2)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input has unknown property: powerLevel

        Actual Value: {
          powerLevel: 9001,
          [Symbol(name)]: "Jimbo",
        }
      `
    )
  })
  it(`rejects everything else`, function () {
    for (const value of [true, 'foo', null, undefined, 2, []]) {
      expect(Person.accepts(value)).to.be.false
      expect(() => Person.assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
          input must be of type:
          
            {
              name: string
              age?: number | null
            }

          Actual Value: ${JSON.stringify(value)}
        `
      )
    }
  })
  it(`circular references`, function () {
    const obj: any = { foo: 1 }
    obj.bar = obj

    const RecursiveObject = t.alias(
      'RecursiveObject',
      t.object({
        foo: t.number(),
        bar: t.ref(() => RecursiveObject),
      })
    )
    const NonRecursiveObject = t.object({
      foo: t.number(),
      bar: t.object({
        foo: t.number(),
        bar: t.object({}),
      }),
    })

    RecursiveObject.assert(obj)
    expect(RecursiveObject.accepts(obj)).to.be.true

    expect(() => NonRecursiveObject.assert(obj)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input.bar.bar has unknown property: foo
        
        Actual Value: <ref *1> {
          foo: 1,
          bar: <ref *1>,
        }
        
        -------------------------------------------------
        
        input.bar.bar has unknown property: bar
        
        Actual Value: <ref *1> {
          foo: 1,
          bar: <ref *1>,
        }
      `
    )
    expect(NonRecursiveObject.accepts(obj)).to.be.false
  })
  it(`.acceptsSomeCompositeTypes is true`, function () {
    expect(t.object({ foo: t.number() }).acceptsSomeCompositeTypes).to.be.true
  })
})
