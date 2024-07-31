import { StoreWritable, Subscription } from 'effector'

export type ICookieService = {
  set<T>(name: string, value: T, options?: CookieOptions, serializeFn?: ((value: T) => string) | boolean): void
  get<T = string>(name: string, parseFn?: ((value: string) => T) | boolean): T | string | undefined
  persist(store: StoreWritable<any>, { key }: { key: string }): Subscription
  remove(name: string): void
}

export interface CookieOptions {
  path?: string
  domain?: string
  expires?: Date
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  maxAge?: number
}
