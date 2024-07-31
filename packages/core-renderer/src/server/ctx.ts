import { AsyncLocalStorage } from 'node:async_hooks'

export const storage = new AsyncLocalStorage<{ req: Record<string, any> }>()

export const getPageCtx = () => {
  return storage.getStore()
}

export const getCurrentRequest = () => {
  return storage.getStore()?.req
}
