import { stringifyPath, resolvePath } from '../Validation'

import Validation from '../Validation'

import RuntimeTypeError from './RuntimeTypeError'
import typeOf from './typeOf'

const delimiter = '\n-------------------------------------------------\n\n'

export default function makeTypeError<T>(
  validation: Validation
): RuntimeTypeError | undefined {
  if (!validation.hasErrors()) {
    return
  }
  const { prefix, input, errors } = validation
  const collected = []
  for (const [path, message, expectedType] of errors) {
    const expected = expectedType ? expectedType.toString() : 'any'
    const actual = resolvePath(input, path)
    const actualType = typeOf(actual)

    const fieldPath = [...validation.path, ...path]

    const interpolatedMessage = message.replace(
      /\$(parentPath|lastPathElement)/g,
      match => {
        switch (match) {
          case '$parentPath':
            return stringifyPath(fieldPath.slice(0, fieldPath.length - 1))
          case '$lastPathElement':
            return stringifyPath(fieldPath.slice(fieldPath.length - 1))
          default:
            return match
        }
      }
    )

    const finalMessage =
      interpolatedMessage !== message
        ? interpolatedMessage
        : `${stringifyPath(fieldPath)} ${message}`

    const actualAsString = makeString(actual)

    if (typeof actualAsString === 'string') {
      collected.push(
        `${finalMessage}\n\nExpected: ${expected}\n\nActual Value: ${actualAsString}\n\nActual Type: ${actualType}\n`
      )
    } else {
      collected.push(
        `${finalMessage}\n\nExpected: ${expected}\n\nActual: ${actualType}\n`
      )
    }
  }
  if (prefix) {
    return new RuntimeTypeError(
      `${prefix.trim()} ${collected.join(delimiter)}`,
      { errors }
    )
  } else {
    return new RuntimeTypeError(collected.join(delimiter), { errors })
  }
}

function makeString(value: any): string | undefined {
  if (value === null) {
    return 'null'
  }
  switch (typeof value) {
    case 'string':
      return JSON.stringify(value)
    case 'number':
      return Object.is(value, -0) ? '-0' : String(value)
    case 'symbol':
    case 'boolean':
    case 'undefined':
      return String(value)
    case 'function':
      return
    default:
      if (
        Array.isArray(value) ||
        value.constructor == null ||
        value.constructor === Object
      ) {
        try {
          return JSON.stringify(value, null, 2)
        } catch (e) {
          return
        }
      }
      return
  }
}
