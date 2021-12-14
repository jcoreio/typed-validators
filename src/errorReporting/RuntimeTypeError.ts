import RuntimeTypeErrorItem from './RuntimeTypeErrorItem'
import stringifyValue from './stringifyValue'

const delimiter = '\n\n-------------------------------------------------\n\n'

export default class RuntimeTypeError extends TypeError {
  name = 'RuntimeTypeError'
  readonly errors: RuntimeTypeErrorItem[]

  constructor(errors: RuntimeTypeErrorItem[]) {
    super()
    this.errors = errors
  }

  get message(): string {
    return this.formatMessage()
  }

  formatMessage({
    limit = 10000,
    includeActualValues = true,
  }: { limit?: number; includeActualValues?: boolean } = {}): string {
    const result = []
    let remaining =
      limit - delimiter.length + `... ${this.errors.length} more errors`.length
    for (let i = 0; i < this.errors.length; i++) {
      const error = this.errors[i]
      if (result.length) remaining -= delimiter.length
      const stringified = error.toString()
      remaining -= stringified.length
      let actualValuePart
      if (includeActualValues) {
        actualValuePart = `\n\nActual Value: ${stringifyValue(
          error.valueAtPath,
          { limit: remaining - `\n\nActual Value: `.length }
        )}`
        remaining -= actualValuePart.length
      }
      if (remaining < 0 && result.length) {
        result.push(`... ${this.errors.length - i} more errors`)
        break
      }
      result.push(
        remaining < 0 || !actualValuePart
          ? stringified
          : stringified + actualValuePart
      )
    }
    return result.join(delimiter)
  }
}
