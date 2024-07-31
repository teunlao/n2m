import { type Identifier } from './types'

export function createIdentifier<T>(value: string): Identifier<T> {
  return { __type: {} as T, value } as Identifier<T>
}

export const createToken = createIdentifier

export function stringify<T>(value: Identifier<T>) {
  return value.value.toString()
}
