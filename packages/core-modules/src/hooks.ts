export type Inferable<T, C = void> = T | ((context: C) => T)

export function infer<T, C = void>(unit: Inferable<T, C>, context?: C): T {
  if (typeof unit === 'function') {
    return (unit as (context: C) => T)(context as C)
  }
  return unit as T
}
