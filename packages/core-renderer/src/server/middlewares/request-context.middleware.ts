import { createMiddleware } from 'hono/factory'
import { RequestContextToken, ShellInjectorHooksToken } from '@n2m/shared-tokens'
import { createImmediateAsyncScope, registry } from '@n2m/core-di'
import { type Context } from 'hono'

function shouldBlockRequest(c: Context) {
  const restrictedPaths = [
    '/api',
    '/storage',
    '/images',
    '/favicon',
    '/frontapi',
    '/frontstorage',
    '/manifest',
    '/null',
    '/undefined',
  ]

  return restrictedPaths.some((path) => c.req.path.startsWith(path))
}

export const provideRequestContext = createMiddleware(async (c, next) => {
  if (shouldBlockRequest(c)) {
    return c.json(
      {
        message: `Restricted path requested app endpoint ${c.req.path}`,
      },
      { status: 403 }
    )
  }

  const rootContainer = registry.get('root')
  const createRequestScope = createImmediateAsyncScope(rootContainer)
  createRequestScope((container) => {
    container.register(RequestContextToken).toValue(c)
    container.register(ShellInjectorHooksToken).toValue([])
  })

  await next()
})
