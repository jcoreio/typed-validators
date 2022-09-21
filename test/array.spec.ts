import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

describe(`t.array`, function () {
  it(`requires elementType to be an instance of Type`, function () {
    expect(() => t.array(2 as any)).to.throw()
  })
  it(`accepts matching arrays`, function () {
    t.array(t.number()).assert([1, 2, 3])
    expect(t.array(t.number()).accepts([1, 2, 3])).to.be.true
    t.array(t.string()).assert(['foo', 'bar', 'baz'])
    expect(t.array(t.string()).accepts(['foo', 'bar', 'baz'])).to.be.true
  })
  it(`rejects non-arrays`, function () {
    expect(t.array(t.number()).accepts({ foo: 'bar' })).to.be.false
    expect(() => t.array(t.number()).assert({ foo: 'bar' })).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be an Array<number>

        Actual Value: {
          foo: "bar",
        }
      `
    )
  })
  it(`rejects nonmatching array elements`, function () {
    expect(t.array(t.number()).accepts([1, 'bar'])).to.be.false
    expect(() =>
      t.array(t.number()).assert([1, 'bar'], '', ['array'])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        array[1] must be a number

        Actual Value: "bar"
      `
    )
    expect(t.array(t.string()).accepts(['foo', 2])).to.be.false
    expect(() =>
      t.array(t.string()).assert(['foo', 2], '', ['array'])
    ).to.throw(
      t.RuntimeTypeError,
      dedent`
        array[1] must be a string

        Actual Value: 2
      `
    )
  })
  it(`circular references`, function () {
    const array: any = [1]
    array.push(array)

    const NonRecursiveArray = t.array(t.oneOf(t.number(), t.array(t.number())))
    const RecursiveArray = t.alias(
      'RecursiveArray',
      t.array(
        t.oneOf(
          t.number(),
          t.ref(() => RecursiveArray)
        )
      )
    )
    expect(() => NonRecursiveArray.assert(array)).to.throw(
      t.RuntimeTypeError,
      dedent`
        input[1][1] must be a number

        Actual Value: <ref *1> [
          1,
          <ref *1>,
        ]
      `
    )
    expect(NonRecursiveArray.accepts(array)).to.be.false

    RecursiveArray.assert(array)
    expect(RecursiveArray.accepts(array)).to.be.true

    const array2: any = []
    array2.push(array2)
    array2.push(2)

    RecursiveArray.assert(array2)
    expect(RecursiveArray.accepts(array2)).to.be.true
    expect(NonRecursiveArray.accepts(array2)).to.be.false
  })
  it(`.acceptsSomeCompositeTypes is true`, function () {
    expect(t.array(t.number()).acceptsSomeCompositeTypes).to.be.true
  })
})
