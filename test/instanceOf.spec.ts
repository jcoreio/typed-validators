import * as t from '../src/'
import { expect } from 'chai'
import dedent from 'dedent-js'

class Foo {}

describe(`t.instanceOf`, function() {
  it(`accepts instances of class type`, function() {
    t.instanceOf(() => Date).assert(new Date())
    t.instanceOf(() => Foo).assert(new Foo())
    expect(t.instanceOf(() => Date).accepts(new Date())).to.be.true
    expect(t.instanceOf(() => Foo).accepts(new Foo())).to.be.true
  })
  it(`rejects not instances of class type`, function() {
    expect(() => t.instanceOf(() => Date).assert({})).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be an instance of Date
        
        Actual Value: {}
      `
    )
    expect(t.instanceOf(() => Date).accepts(new Foo())).to.be.false
    expect(() => t.instanceOf(() => Date).assert(new Foo())).to.throw(
      t.RuntimeTypeError,
      dedent`
        input must be an instance of Date
        
        Actual Value: [object Object]
      `
    )
    expect(t.instanceOf(() => Date).accepts(new Foo())).to.be.false
  })
  it(`.acceptsSomeCompositeTypes is true`, function() {
    expect(t.instanceOf(() => Date).acceptsSomeCompositeTypes).to.be.true
  })
})
