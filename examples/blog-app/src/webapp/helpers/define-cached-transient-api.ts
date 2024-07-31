export function defineCachedTransientApi<T, K>(factory: (key: K) => T) {
  const cache = new Map<K, T>()

  return (key: K): T => {
    if (!cache.has(key)) {
      cache.set(key, factory(key))
    }
    return cache.get(key)!
  }
}
