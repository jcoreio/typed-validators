import * as t from '../src'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe(`Validation`, function () {
  it(`hasErrors`, function () {
    expect(t.number().validate(1).hasErrors()).to.be.false
    expect(t.number().validate('foo').hasErrors()).to.be.true
  })
})
