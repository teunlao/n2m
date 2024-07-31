// serverHooks.ts
import { containerRegistry } from '../registry.ts'
import { type Identifier } from '../types.ts'
import { useScopedContainer } from '../async-scope.ts'

export function injectDependency<T>(token: Identifier<T>, options: { throwIfNotFound?: boolean } = {}): T {
  const { throwIfNotFound = false } = options

  try {
    const container = useScopedContainer()
    return container.resolve(token)
  } catch (error) {
    for (const containerName of containerRegistry.keys()) {
      try {
        const container = containerRegistry.get(containerName)
        return container.resolve(token)
      } catch (e) {
        // ignore error and try next container
      }
    }

    if (throwIfNotFound) {
      throw new Error(`Dependency with token ${String(token.value)} not found in any container`)
    }

    return undefined as T
  }
}

export function diDebug() {
  // TODO
}
