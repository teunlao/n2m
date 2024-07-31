import Cookies from 'js-cookie'
import type { CookieOptions, ICookieService } from '../shared/types.ts'
import { StoreWritable } from 'effector'

export class CookiesService implements ICookieService {
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

    const currentDate = new Date()

    const expirationDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())

    if (!options?.expires) {
      options = {
        ...options,
        expires: expirationDate,
      }
    }

    Cookies.set(name, serializedValue, {
      path: options?.path || '/',
      domain: options?.domain,
      expires: options?.expires,
      secure: options?.secure || false,
      sameSite: options?.sameSite || 'strict',
    })
  }

  get(name: string, parseFn?: ((value: string) => any) | boolean): any {
    const value = Cookies.get(name)

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

  remove(name: string): void {
    Cookies.remove(name)
  }
}
