import { createMiddleware } from 'hono/factory'

export const createPwaRedirectMiddleware = (url: string) =>
  createMiddleware(async (c, next) => {
    if (c.req.query('action') === 'redirect') {
      return c.redirect(url)
    }

    return next()
  })
