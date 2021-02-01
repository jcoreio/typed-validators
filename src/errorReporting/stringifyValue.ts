export default function stringifyValue(value: any): string {
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
      return String(value)
    default:
      if (
        Array.isArray(value) ||
        value.constructor == null ||
        value.constructor === Object
      ) {
        try {
          return JSON.stringify(value, null, 2)
        } catch (e) {
          // fallthrough
        }
      }
      break
  }
  return String(value)
}
