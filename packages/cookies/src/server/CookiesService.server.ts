import { CookieOptions } from '../shared/types.ts'
import { parse as _parse, serialize as _serialize } from 'hono/utils/cookie'
import { StoreWritable } from 'effector'

export class CookiesService implements CookiesService {
  constructor(
    private readonly reqHeaders: Headers,
    private readonly resHeaders: Headers
  ) {}

  set(name: string, value: any, options?: CookieOptions, serializeFn?: ((value: any) => string) | boolean): void {
    let serializedValue: string

    if (typeof serializeFn === 'function') {
      try {
        serializedValue = serializeFn(value)
      } catch (error) {
        console.error(`Error serializing cookie value for "${name}":`, error)
        return
      }
    } else if (serializeFn === true) {
      try {
        serializedValue = JSON.stringify(value)
      } catch (error) {
        console.error(`Error serializing JSON cookie value for "${name}":`, error)
        return
      }
    } else {
      serializedValue = String(value)
    }

    if (!options?.expires) {
      const currentDate = new Date()

      const expirationDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())

      options = {
        ...options,
        expires: expirationDate,
      }
    }

    const cookie = _serialize(name, serializedValue, options)

    const existingReqCookies = this.reqHeaders.get('Cookie') || ''
    const updatedReqCookies = existingReqCookies ? `${existingReqCookies}; ${cookie}` : cookie
    this.reqHeaders.set('Cookie', updatedReqCookies)
    this.resHeaders.append('set-cookie', cookie)
  }

  get(name: string, parseFn?: ((value: string) => any) | boolean): any {
    const cookieHeader = this.reqHeaders.get('Cookie')
    const cookieObject = _parse(cookieHeader ?? '', name)
    const value = cookieObject[name]

    if (value === undefined) {
      return undefined
    }

    if (typeof parseFn === 'function') {
      try {
        return parseFn(value)
      } catch (error) {
        console.error(`Error parsing cookie value for "${name}":`, error)
        return undefined
      }
    }

    if (parseFn === true) {
      try {
        return JSON.parse(value)
      } catch (error) {
        console.error(`Error parsing JSON cookie value for "${name}":`, error)
        return undefined
      }
    }

    return value
  }

  persist(store: StoreWritable<any>, { key, cookieOptions }: { key: string; cookieOptions?: CookieOptions }) {
    return store.watch((value) => {
      if (value) {
        this.set(key, value, cookieOptions ?? {})
      }
    })
  }

  remove(name: string, options?: CookieOptions): void {
    this.set(name, '', { ...options, maxAge: 0 })
  }
}
