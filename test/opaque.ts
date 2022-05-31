import * as t from '../src'
import { expect } from 'chai'

describe(`t.opaque`, function() {
  const DateString: t.OpaqueType<any> = t.opaque(() => t.string())

  it(`works`, function() {
    DateString.assert('foo')
    expect(DateString.accepts('foo')).to.be.true
  })
})
