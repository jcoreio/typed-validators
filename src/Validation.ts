import Type from './types/Type'
import { weakSetAdd, weakSetDelete, weakSetHas } from './cyclic'
import RuntimeTypeErrorItem from './errorReporting/RuntimeTypeErrorItem'

export type IdentifierPath = Array<string | number | symbol>

export default class Validation {
  readonly input: any

  readonly path: IdentifierPath = []

  readonly prefix: string

  readonly errors: RuntimeTypeErrorItem[] = []

  // Tracks whether we're in validation of cyclic objects.
  cyclic: WeakMap<Type<any>, WeakSet<any>> = new WeakMap()

  constructor(input: any, prefix = '', path?: IdentifierPath) {
    this.input = input
    this.prefix = prefix
    if (path) this.path.push(...path)
  }

  inCycle(type: Type<any>, input: any): boolean {
    const tracked = this.cyclic.get(type)
    if (!tracked) {
      return false
    } else {
      return weakSetHas(tracked, input)
    }
  }

  startCycle(type: Type<any>, input: any): void {
    let tracked = this.cyclic.get(type)
    if (!tracked) {
      tracked = new WeakSet()
      this.cyclic.set(type, tracked)
    }
    weakSetAdd(tracked, input)
  }

  endCycle(type: Type<any>, input: any): void {
    const tracked = this.cyclic.get(type)
    if (tracked) {
      weakSetDelete(tracked, input)
    }
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }
}

const validIdentifierOrAccessor = /^[$A-Z_][0-9A-Z_$[\].]*$/i

export function stringifyPath(path: IdentifierPath): string {
  if (!path.length) {
    return 'input'
  }
  const { length } = path
  const parts = new Array(length)
  for (let i = 0; i < length; i++) {
    const part = path[i]
    if (typeof part !== 'string' || !validIdentifierOrAccessor.test(part)) {
      parts[i] = `[${String(part)}]`
    } else if (i > 0) {
      parts[i] = `.${String(part)}`
    } else {
      parts[i] = String(part)
    }
  }
  return parts.join('')
}
