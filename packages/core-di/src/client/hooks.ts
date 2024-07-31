// clientHooks.ts
import { containerRegistry } from '../registry.ts'
import { type Identifier } from '../types.ts'

export function injectDependency<T>(token: Identifier<T>, options: { throwIfNotFound?: boolean } = {}): T | undefined {
  const { throwIfNotFound = false } = options

  for (const containerName of getContainerNames()) {
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

  return undefined
}

function getContainerNames(): string[] {
  return Array.from(containerRegistry.keys())
}

export function diDebug() {
  containerRegistry.debug()
}

// to compatibility with server side async scope
export function useScopedContainer() {
  return containerRegistry.get('root')
}
