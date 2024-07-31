type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never

type Path<T> = PathImpl<T, keyof T> | keyof T

type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? R extends Path<T[K]>
      ? PathValue<T[K], R>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never

export function of<T, P extends Path<T>>(obj: T, path: P): NonNullable<PathValue<T, P>> {
  return path.split('.').reduce((current: any, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

export function anyOf<T, P extends Path<T>>(obj: T, path: P) {
  return path.split('.').reduce((current: any, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj) as any
}
