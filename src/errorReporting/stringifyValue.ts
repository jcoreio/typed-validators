import { keyToString } from './keyToString'

type Options = {
  indent?: string
  limit?: number
  enclosing?: WeakMap<any, number | null>
  refCounter?: [number]
  reachedLimit?: [boolean]
}

export default function stringifyValue(
  value: any,
  options: Options = {}
): string {
  const {
    indent = '',
    limit = Infinity,
    enclosing = new WeakMap(),
    refCounter = [0] as [number],
    reachedLimit = [false] as [boolean],
  } = options
  if (value === null) {
    return 'null'
  }
  switch (typeof value) {
    case 'string': {
      const result = JSON.stringify(value)
      if (result.length > limit) {
        const truncTo =
          limit - ` ... ${result.length - limit} more characters"`.length - 1
        const numElided = result.length - truncTo
        return (
          result.substring(0, truncTo) +
          ` ... ${numElided} more character${numElided === 1 ? '' : 's'}"`
        )
      }
      return result
    }
    case 'number':
      return Object.is(value, -0) ? '-0' : String(value)
    case 'symbol':
    case 'boolean':
    case 'undefined':
      return String(value)
    case 'function':
      return `[function ${value.name}]`
  }
  if (enclosing.has(value)) {
    let refNumber = enclosing.get(value)
    if (refNumber == null) {
      refNumber = ++refCounter[0]
      enclosing.set(value, refNumber)
    }
    return `<ref *${refNumber}>`
  }
  enclosing.set(value, null)
  try {
    const nextIndent = indent + '  '
    const recurseOptions: Options = {
      indent: nextIndent,
      limit,
      enclosing,
      reachedLimit,
      refCounter,
    }
    if (Array.isArray(value)) {
      // ARRAY
      if (!value.length) return `[]`
      let remaining =
        limit -
        `[\n${nextIndent}... ${value.length} more elements\n${indent}]`.length
      const lines = ['[']
      for (let i = 0; i < value.length; i++) {
        const elem = value[i]
        recurseOptions.limit = remaining - (nextIndent.length + 1)
        const stringified =
          nextIndent + stringifyValue(elem, recurseOptions) + ','
        remaining -= stringified.length + 1
        if (remaining < 0 || reachedLimit[0]) {
          const numElided = value.length - i
          lines.push(
            `${nextIndent}... ${numElided} more element${
              numElided === 1 ? '' : 's'
            }`
          )
          break
        }
        lines.push(stringified)
      }
      lines.push(indent + ']')
      const refNumber = enclosing.get(value)
      if (refNumber != null) lines[0] = `<ref *${refNumber}> ${lines[0]}`
      return lines.join('\n')
    } else {
      // OBJECT
      const { constructor } = value
      const opener =
        constructor != null && constructor !== Object
          ? `${constructor.name} {`
          : '{'
      const keys = [
        ...Object.keys(value),
        ...Object.getOwnPropertySymbols(value),
      ]
      let remaining =
        limit -
        `${opener}\n${nextIndent}... ${keys.length} more properties\n${indent}}`
          .length
      const lines = [opener]
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const propValue = value[key]
        const stringifiedKey = keyToString(key)
        recurseOptions.limit =
          remaining - (stringifiedKey.length + 3 + nextIndent.length)
        const stringifiedValue = stringifyValue(propValue, recurseOptions)
        const final = `${nextIndent}${stringifiedKey}: ${stringifiedValue},`
        remaining -= final.length + 1
        if (remaining < 0 || reachedLimit[0]) {
          const numElided = keys.length - i
          lines.push(
            `${nextIndent}... ${numElided} more propert${
              numElided === 1 ? 'y' : 'ies'
            }`
          )
          break
        }
        lines.push(final)
      }
      if (lines.length === 1) return opener + '}'
      lines.push(indent + '}')

      const refNumber = enclosing.get(value)
      if (refNumber != null) lines[0] = `<ref *${refNumber}> ${lines[0]}`

      return lines.join('\n')
    }
  } finally {
    enclosing.delete(value)
  }
}
