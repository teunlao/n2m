import { AsyncLocalStorage } from 'async_hooks'
import { type Container } from './types'

const asyncLocalStorage = new AsyncLocalStorage<Container>()

export function createAsyncScope(parentContainer: Container) {
  return async <T>(callback: () => Promise<T> | T): Promise<T> => {
    const scopedContainer = parentContainer.createScope()
    return asyncLocalStorage.run(scopedContainer, async () => {
      try {
        return await callback()
      } finally {
        asyncLocalStorage.exit(() => {})
      }
    })
  }
}

export function createImmediateAsyncScope(parentContainer: Container) {
  return (callback?: (container: Container) => void): void => {
    const scopedContainer = parentContainer.createScope()
    asyncLocalStorage.enterWith(scopedContainer)
    callback?.(scopedContainer)
  }
}

export function useScopedContainer(): Container {
  const container = asyncLocalStorage.getStore()
  if (!container) {
    throw new Error('Container is not available in this async context')
  }
  return container
}
