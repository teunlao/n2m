import { beforeEach, describe, expect, it, vi } from 'vitest'
import Cookies from 'js-cookie'
import { CookiesService } from './CookiesService.client.ts'
import { CookieOptions } from '../shared/types.ts'

describe('CookieService Client', () => {
  let cookieService: CookiesService

  beforeEach(() => {
    cookieService = new CookiesService()
    Cookies.remove('username')
    Cookies.remove('token')
    Cookies.remove('emptyCookie')
    Cookies.remove('specialCookie')
  })

  it('should set a cookie with the given name and value', () => {
    cookieService.set('username', 'john')
    expect(Cookies.get('username')).toBe('john')
  })

  it('should set a cookie with the given options', () => {
    const options: CookieOptions = {
      path: '/',
      secure: false,
      sameSite: 'Strict',
    }

    cookieService.set('token', 'abc123', options)
    expect(Cookies.get('token')).toBe('abc123')
  })

  it('should restrict the cookie with secure option', () => {
    const options: CookieOptions = {
      secure: true,
    }

    cookieService.set('secureCookie', 'secureValue', options)
    expect(Cookies.get('secureCookie')).toBeUndefined()
  })

  it('should set a cookie with an empty value', () => {
    cookieService.set('emptyCookie', '')
    expect(Cookies.get('emptyCookie')).toBe('')
  })

  it('should set a cookie with special characters', () => {
    cookieService.set('specialCookie', 'value;with,special:chars')
    expect(Cookies.get('specialCookie')).toBe('value;with,special:chars')
  })

  it('should return the value of a cookie with the given name', () => {
    Cookies.set('username', 'john')
    expect(cookieService.get('username')).toBe('john')
  })

  it('should return undefined for a non-existing cookie', () => {
    expect(cookieService.get('nonExistingCookie')).toBeUndefined()
  })

  it('should remove a cookie with the given name', () => {
    Cookies.set('username', 'john')
    cookieService.remove('username')
    expect(Cookies.get('username')).toBeUndefined()
  })

  it('should set a cookie with a serialized object value', () => {
    const objectValue = { name: 'John', age: 30 }
    cookieService.set('objectCookie', objectValue, undefined, true)
    expect(Cookies.get('objectCookie')).toBe(JSON.stringify(objectValue))
  })

  it('should get a cookie with a deserialized object value', () => {
    const objectValue = { name: 'John', age: 30 }
    Cookies.set('objectCookie', JSON.stringify(objectValue))
    expect(cookieService.get('objectCookie', true)).toEqual(objectValue)
  })

  it('should set a cookie with a custom serialized value', () => {
    const customValue = { id: 123, token: 'abc456' }
    const serializeFn = (value: any) => `${value.id}_${value.token}`
    cookieService.set('customSerializedCookie', customValue, undefined, serializeFn)
    expect(Cookies.get('customSerializedCookie')).toBe('123_abc456')
  })

  it('should get a cookie with a custom deserialized value', () => {
    const customValue = { id: 123, token: 'abc456' }
    const serializedValue = '123_abc456'
    const parseFn = (value: string) => {
      const [id, token] = value.split('_')
      return { id: Number(id), token }
    }
    Cookies.set('customSerializedCookie', serializedValue)
    expect(cookieService.get('customSerializedCookie', parseFn)).toEqual(customValue)
  })

  it('should handle error when serializing cookie value', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const circularObject = { prop: null }
    // @ts-expect-error ignore
    circularObject.prop = circularObject

    cookieService.set('errorCookie', circularObject, undefined, true)

    expect(Cookies.get('errorCookie')).toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error serializing JSON cookie value for "errorCookie":'),
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('should handle error when deserializing cookie value', () => {
    const invalidJsonValue = '{invalid-json}'
    Cookies.set('errorCookie', invalidJsonValue)
    expect(cookieService.get('errorCookie', true)).toBeUndefined()
  })
})
