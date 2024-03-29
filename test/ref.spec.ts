import * as t from '../src/'
import dedent from 'dedent-js'
import { expect } from 'chai'

describe(`t.ref`, function () {
  const NodeType: t.TypeAlias<{
    value: any
    left?: Node
    right?: Node
  }> = t.alias(
    'Node',
    t.object({
      required: {
        value: t.any(),
      },
      optional: {
        left: t.ref(() => NodeType),
        right: t.ref(() => NodeType),
      },
    })
  )

  type Node = t.ExtractType<typeof NodeType>

  it(`accepts recursive types`, function () {
    const value = {
      value: 'foo',
      left: {
        value: 2,
        right: {
          value: 3,
        },
      },
      right: {
        value: 6,
      },
    }
    NodeType.assert(value)
    expect(NodeType.accepts(value)).to.be.true
  })
  it(`throws correct errors within recursive types`, function () {
    const value = {
      value: 'foo',
      left: {
        value: 2,
        right: {
          value: 3,
          bar: 3,
        },
      },
      right: {
        value: 6,
      },
    }
    expect(() => NodeType.assert(value, '', ['node'])).to.throw(
      t.RuntimeTypeError,
      dedent`
        node.left.right has unknown property: bar
        
        Actual Value: {
          value: 3,
          bar: 3,
        }
      `
    )
    expect(NodeType.accepts(value)).to.be.false
  })
  it(`.acceptsSomeCompositeTypes`, function () {
    expect(t.ref(() => t.alias('Foo', t.number())).acceptsSomeCompositeTypes).to
      .be.false
    expect(
      t.ref(() => t.alias('Foo', t.array(t.number()))).acceptsSomeCompositeTypes
    ).to.be.true
  })
})
