import RuntimeTypeErrorItem from './RuntimeTypeErrorItem'
import stringifyValue from './stringifyValue'

const delimiter = '\n\n-------------------------------------------------\n\n'

export default class RuntimeTypeError extends TypeError {
  name = 'RuntimeTypeError'
  errors: RuntimeTypeErrorItem[]

  constructor(errors: RuntimeTypeErrorItem[]) {
    super()
    this.errors = errors
  }

  get message(): string {
    return this.errors
      .map(
        e => `${e.toString()}\n\nActual Value: ${stringifyValue(e.valueAtPath)}`
      )
      .join(delimiter)
  }
}
