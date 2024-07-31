import { type Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { useRootConfig } from '@n2m/core-config/shared'

export const authorizedMiddleware = createMiddleware(async (c: Context, next) => {
  const querySecret = c.req.query('secret')

  if (!querySecret || querySecret !== useRootConfig().prerenderSecret) {
    return c.json({ message: 'Unauthorized' }, { status: 401 })
  }
  return next()
})
