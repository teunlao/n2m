import { beforeEach, describe, expect, it } from 'vitest'
import { Hono } from 'hono'
import { CookiesService } from './CookiesService.server.ts'
import { CookieOptions } from '../shared/types.ts'

describe('CookiesService Server', () => {
  let app: Hono
  let cookiesService: CookiesService

  beforeEach(() => {
    app = new Hono()
    app.use(async (c, next) => {
      cookiesService = new CookiesService(c.req.raw.headers, c.res.headers)
      await next()
    })
  })

  it('should return undefined for a non-existing cookie', async () => {
    app.get('/', (c) => {
      expect(cookiesService.get('nonExistingCookie')).toBeUndefined()
      return c.text('Cookie not found')
    })

    await app.request('http://localhost/')
  })

  it('should set a cookie with the given name and value', async () => {
    app.get('/', (c) => {
      cookiesService.set('username', 'john')

      expect(cookiesService.get('username')).toBe('john')
      return c.text('Cookie set')
    })

    const res = await app.request('http://localhost/')
    expect(cookiesService.get('username')).toBe('john')
    expect(res.headers.get('Set-Cookie')).toContain('username=john')
  })

  it('should set a cookie with the given options', async () => {
    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      domain: 'example.com',
      expires: new Date('2023-12-31'),
      maxAge: 3600,
      path: '/api',
    }

    app.get('/', (c) => {
      cookiesService.set('token', 'abc123', options)
      return c.text('Cookie set')
    })

    const res = await app.request('http://localhost/')

    expect(cookiesService.get('token')).toBe('abc123')

    const cookie = res.headers.get('Set-Cookie')
    expect(cookie).toContain('token=abc123')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Secure')
    expect(cookie).toContain('SameSite=Strict')
    expect(cookie).toContain('Domain=example.com')
    expect(cookie).toContain('Expires=Sun, 31 Dec 2023')
    expect(cookie).toContain('Max-Age=3600')
    expect(cookie).toContain('Path=/api')
  })

  it('should remove a cookie with the given name', async () => {
    app.get('/', (c) => {
      cookiesService.set('username', 'john')
      expect(cookiesService.get('username')).toBe('john')

      cookiesService.remove('username')
      expect(c.req.raw.headers.get('Cookie')).toContain('username=john')
      expect(cookiesService.get('username')).toBe('')

      return c.text('Cookie removed')
    })

    const res = await app.request('http://localhost/')
    expect(cookiesService.get('username')).toBe('')
    expect(res.headers.get('Set-Cookie')).toContain('username=; Max-Age=0')
  })

  it('should set a cookie with an empty value', async () => {
    app.get('/', (c) => {
      cookiesService.set('emptyCookie', '')
      expect(cookiesService.get('emptyCookie')).toBe('')
      return c.text('Cookie set')
    })

    const res = await app.request('http://localhost/')
    expect(cookiesService.get('emptyCookie')).toBe('')
    expect(res.headers.get('Set-Cookie')).toContain('emptyCookie=')
  })

  it('should set a cookie with special characters', async () => {
    app.get('/', (c) => {
      cookiesService.set('specialCookie', 'value;with,special:chars')
      expect(cookiesService.get('specialCookie')).toBe('value;with,special:chars')
      return c.text('Cookie set')
    })

    const res = await app.request('http://localhost/')

    expect(cookiesService.get('specialCookie')).toBe('value;with,special:chars')
    expect(res.headers.get('Set-Cookie')).toContain('specialCookie=value%3Bwith%2Cspecial%3Achars')
  })

  it('should set multiple cookies', async () => {
    app.get('/', (c) => {
      cookiesService.set('cookie1', 'value1')
      cookiesService.set('cookie2', 'value2')
      cookiesService.set('cookie3', 'value3')

      expect(cookiesService.get('cookie1')).toBe('value1')
      expect(cookiesService.get('cookie2')).toBe('value2')
      expect(cookiesService.get('cookie3')).toBe('value3')

      return c.text('Cookies set')
    })

    const res = await app.request('http://localhost/')
    const resCookies = res.headers.get('Set-Cookie')

    expect(cookiesService.get('cookie1')).toBe('value1')
    expect(cookiesService.get('cookie2')).toBe('value2')
    expect(cookiesService.get('cookie3')).toBe('value3')

    expect(resCookies).toContain('cookie1=value1')
    expect(resCookies).toContain('cookie2=value2')
    expect(resCookies).toContain('cookie3=value3')
  })
})
