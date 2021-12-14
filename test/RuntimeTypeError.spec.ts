import { describe, it } from 'mocha'
import { expect } from 'chai'
import * as t from '../src/'
import dedent from 'dedent-js'

function expectError(type: t.Type<any>, input: any): t.RuntimeTypeError {
  try {
    type.assert(input)
    throw new Error(`expected assertion to throw an error`)
  } catch (err) {
    if (err instanceof t.RuntimeTypeError) return err
    throw err
  }
}

describe(`RuntimeTypeError`, function() {
  describe(`.formatMessage`, function() {
    it(`works on class types`, function() {
      const TestType = t.array(t.object({ foo: t.number() }))
      const testValue = [{ foo: new Date(10000000000) }]

      expect(expectError(TestType, testValue).formatMessage()).to.equal(
        dedent`
          input[0].foo must be a number
          
          Actual Value: Date {}
        `
      )
    })
    it(`works on circular references`, function() {
      const TestType = t.array(t.object({ foo: t.number() }))
      const testValue = []
      testValue.push(testValue)

      const obj: Record<string, any> = {}
      obj.foo = obj
      testValue.push(obj)

      expect(expectError(TestType, testValue).formatMessage()).to.equal(
        dedent`
          input[0] must be of type:
          
            {
              foo: number
            }
          
          Actual Value: <ref *1> [
            <ref *1>,
            <ref *2> {
              foo: <ref *2>,
            },
          ]

          -------------------------------------------------
          
          input[1].foo must be a number
          
          Actual Value: <ref *1> {
            foo: <ref *1>,
          }
        `
      )
    })
    it(`includeActualValues: false`, function() {
      const TestType = t.array(t.object({ foo: t.number() }))
      const testValue = []
      for (let i = 0; i < 2; i++) {
        testValue.push({
          foo: 'this is a long long long long long property name',
        })
      }

      expect(
        expectError(TestType, testValue).formatMessage({
          includeActualValues: false,
        })
      ).to.equal(
        dedent`
          input[0].foo must be a number
          
          -------------------------------------------------
          
          input[1].foo must be a number
        `
      )
    })
    it(`limit works on number of errors`, function() {
      const TestType = t.array(t.object({ foo: t.number() }))
      const testValue = []
      for (let i = 0; i < 100; i++) {
        testValue.push({
          foo: 'this is a long long long long long property name',
        })
      }

      expect(
        expectError(TestType, testValue).formatMessage({ limit: 300 })
      ).to.equal(
        dedent`
          input[0].foo must be a number
          
          Actual Value: "this is a long long long long long property name"
          
          -------------------------------------------------
          
          input[1].foo must be a number
          
          Actual Value: "this is a long long long long long property name"
          
          -------------------------------------------------
          
          ... 98 more errors
        `
      )
    })
    it(`limit works on long string values`, function() {
      const TestType = t.array(t.object({ foo: t.number() }))
      const testValue = []
      const longString = 'long string '.repeat(1000)
      for (let i = 0; i < 100; i++) {
        testValue.push({
          foo: longString,
        })
      }

      expect(
        expectError(TestType, testValue).formatMessage({ limit: 200 })
      ).to.equal(
        dedent`
          input[0].foo must be a number
          
          Actual Value: "long string long string long string long string long string long string long string long str ... 11909 more characters"
          
          -------------------------------------------------
          
          ... 99 more errors
        `
      )
    })
    it(`limit works on long string values in an object`, function() {
      const TestType = t.array(t.number())
      const testValue = []
      const longString = 'long string '.repeat(1000)
      for (let i = 0; i < 100; i++) {
        testValue.push({
          foo: longString,
        })
      }

      expect(
        expectError(TestType, testValue).formatMessage({ limit: 200 })
      ).to.equal(
        dedent`
          input[0] must be a number
          
          Actual Value: {
            foo: "long string long string long string long string long string l ... 11940 more characters",
          }
          
          -------------------------------------------------
          
          ... 99 more errors
        `
      )
    })

    it(`limit works on too many object properties`, function() {
      const TestType = t.array(t.number())
      const testValue = {}
      for (let i = 0; i < 100; i++) {
        testValue[`foo${i}`] = 'this is a test'
      }

      expect(
        expectError(TestType, testValue).formatMessage({ limit: 200 })
      ).to.equal(
        dedent`
          input must be an Array<number>
          
          Actual Value: {
            foo0: "this is a test",
            foo1: "this is a test",
            foo2: "this is a test",
            ... 97 more properties
          }
        `
      )
    })

    it(`limit works on too many array elements`, function() {
      const TestType = t.object({ foo: t.number() })
      const testValue = []
      for (let i = 0; i < 100; i++) {
        testValue.push('this is a test')
      }

      expect(
        expectError(TestType, testValue).formatMessage({ limit: 200 })
      ).to.equal(
        dedent`
          input must be of type:
          
            {
              foo: number
            }
          
          Actual Value: [
            "this is a test",
            "this is a test",
            "this is a test",
            ... 97 more elements
          ]
        `
      )
    })
  })
})
