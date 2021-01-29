import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'
import typeOf from '../src/errorReporting/typeOf'

describe(`t.object`, function() {
  const Person = t.object({
    required: {
      name: t.string(),
    },
    optional: {
      age: t.nullOr(t.number()),
    },
  })
  it(`accepts matching object`, function() {
    for (const value of [
      { name: 'Jimbo' },
      { name: 'Jimbo', age: null },
      { name: 'Jimbo', age: 20 },
    ]) {
      expect(Person.accepts(value)).to.be.true
      Person.assert(value)
    }
  })
  it(`rejects missing properties`, function() {
    expect(Person.accepts({ age: 20 })).to.be.false
    expect(() => Person.assert({ age: 20 })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input is missing required property: name

        Expected: name: string

        Actual Value: undefined

        Actual Type: undefined
      `
    )
  })
  it(`validates properties`, function() {
    const value = { name: 1 }
    expect(Person.accepts(value)).to.be.false
    expect(() => Person.assert(value, undefined, ['value'])).to.throw(
      t.RuntimeTypeError,
      dedent`
        value.name must be a string

        Expected: string

        Actual Value: 1

        Actual Type: number`
    )
  })
  it(`deep validation`, function() {
    const People = t.array(Person)
    const values = [{ name: 1 }, { name: 'Jimbo', age: 'old' }]
    expect(() => People.assert(values, undefined, ['values'])).to.throw(
      t.RuntimeTypeerror,
      dedent`
        values[0].name must be a string
        
        Expected: string
        
        Actual Value: 1
        
        Actual Type: number
        
        -------------------------------------------------
        
        values[1].age must be one of: number | null
        
        Expected: number | null
        
        Actual Value: "old"
        
        Actual Type: string
      `
    )
  })
  it(`rejects extraneous properties`, function() {
    const value = { name: 'Jimbo', powerLevel: 9001 }
    expect(Person.accepts(value)).to.be.false
    expect(() => Person.assert(value)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input has unknown property: powerLevel

        Expected: undefined

        Actual Value: 9001

        Actual Type: number
      `
    )
  })
  it(`rejects everything else`, function() {
    for (const value of [true, 'foo', null, undefined, 2, []]) {
      expect(Person.accepts(value)).to.be.false
      expect(() => Person.assert(value)).to.throw(
        t.RuntimeTypeError,
        dedent`
        input must be an object

        Expected: ${Person.toString()}

        Actual Value: ${JSON.stringify(value)}

        Actual Type: ${typeOf(value)}`
      )
    }
  })
  it(`.acceptsSomeCompositeTypes is true`, function() {
    expect(t.object({ foo: t.number() }).acceptsSomeCompositeTypes).to.be.true
  })
})
