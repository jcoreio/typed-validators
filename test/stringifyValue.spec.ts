import { describe, it } from 'mocha'
import { expect } from 'chai'
import stringifyValue from '../src/errorReporting/stringifyValue'

describe(`stringifyValue`, function () {
  it(`on functions`, function () {
    expect(
      stringifyValue(function foo() {
        // noop
      })
    ).to.equal('[function foo]')
  })
})
