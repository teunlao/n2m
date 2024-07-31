import { provideRequestContext } from '@n2m/core-renderer'
import { registry } from '@n2m/core-di'
import { Hono } from 'hono'
import { createRootConfig, requestConfigBinding } from '@n2m/core-config'
import { prerender } from '@n2m/core-prerender'
import { serveStatic } from '@hono/node-server/serve-static'
import { provideCookiesService } from '@n2m/cookies/server'
import { provideCoreEvents } from '@n2m/adapter-effector'
import { provideRouterMiddleware } from '@n2m/router/server'
import { serve } from '@hono/node-server'
import { handleAppRequest, logger, proxyRequest } from '@n2m/entry/api'
import { compress } from 'hono/compress'
import { prerenderConfig } from './prerender.config.ts'
import { RootConfigToken } from '@n2m/core-config/shared'
import { renderProps } from './router.config.tsx'
import { serverHandler } from './app.tsx'
import { config } from 'dotenv'
import { setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

config({ path: '.env' })

const container = registry.get('root')
container.register(RootConfigToken).toValue(createRootConfig())

const server = new Hono()

prerender.registerRoutes(server, prerenderConfig)

server.post('/api/users/logout', async (c) => {
  setCookie(c, 'payload-token', '', { maxAge: 0 })

  return c.json({ message: 'logged out' })
})

server.use('/api/*', logger(), proxyRequest)

if (import.meta.env.PROD) {
  server
    .use('/assets/*', compress(), serveStatic({ root: './dist/public' }))
    .use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))
    .use('/manifest.json', serveStatic({ path: './dist/public/manifest.json' }))
    .use('/media/*', compress(), serveStatic({ root: './public' }))
} else {
  server
    .use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }))
    .use('/manifest.json', serveStatic({ path: './public/manifest.json' }))
    .use('/media/*', serveStatic({ root: './public' }))
}

server.get(
  '*',
  provideRequestContext,
  provideCookiesService,
  requestConfigBinding,
  prerender.middlewares.rps,
  prerender.middlewares.handler,
  provideCoreEvents,
  provideRouterMiddleware(renderProps.records, renderProps.routes),
  (c) => {
    return handleAppRequest({
      c,
      serverHandler: serverHandler,
      renderProps: renderProps,
    })
  }
)

if (import.meta.env.PROD) {
  const port = Number(process.env.PORT) || 5554
  serve(
    {
      port,
      fetch: server.fetch,
    },
    () => {
      console.log(`🚀 Server running at http://localhost:${port}`)
      if (prerenderConfig) {
        prerender.pregeneratePages()
      }
    }
  )
}

export default server
