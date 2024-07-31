import { useScopedContainer } from '@n2m/core-di/next'
import { createMiddleware } from 'hono/factory'
import { CookiesService } from '../../server'
import { CookiesServiceToken } from '../../shared'

export const provideCookiesService = createMiddleware(async (c, next) => {
  useScopedContainer().register(CookiesServiceToken).toValue(new CookiesService(c.req.raw.headers, c.res.headers))

  return await next()
})
