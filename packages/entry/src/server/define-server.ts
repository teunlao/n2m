import { createLoadableCache } from '@n2m/cache'
import {
  createRequestWithExternalConfigBinding,
  createRootConfig,
  type ExternalConfigRawData,
  requestConfigBinding,
} from '@n2m/core-config/server'
import { mapExternalConfig, type MappedExternalConfigRawData, RootConfigToken } from '@n2m/core-config/shared'
import { provideCookiesService } from '@n2m/cookies/server'
import { registry } from '@n2m/core-di/next'
import { provideCoreEvents } from '@n2m/adapter-effector'
import {
  handleAppRequest,
  handleRobotsRequest,
  handleUncaughtNodeExceptions,
  logger,
  proxyRequest,
} from '@n2m/entry/api'
import { mocksMiddleware } from '@n2m/core-mocks'
import { prerender, type PrerenderConfig } from '@n2m/core-prerender'
import { provideRequestContext, ServerHandlerFn } from '@n2m/core-renderer'
import { type RouterResult } from '@n2m/router/react'
import { provideRouterMiddleware } from '@n2m/router/server'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import axios from 'axios'
import { Hono, type MiddlewareHandler } from 'hono'
import { compress } from 'hono/compress'

type StaticFile = {
  route: string
  path: string
}

type ServerConfig = {
  port?: number
  staticFiles?: StaticFile[]
  prerenderConfig?: PrerenderConfig
  renderProps: RouterResult<any>
  serverHandler: ServerHandlerFn
  middlewares?: MiddlewareHandler[]
  routes?: (server: Hono) => void
}

function createExternalConfigCache() {
  if (!import.meta.env.SSR) {
    return null
  }

  return createLoadableCache<MappedExternalConfigRawData>({
    key: 'externalConfig',
    ttl: 60 * 60 * 1000,
    loader: async () => {
      const BACKEND_URL = process.env.BACKEND_URL ?? import.meta.env.VITE_BACKEND_URL

      return axios.get<ExternalConfigRawData>(`${BACKEND_URL}/api/v2/init`).then((response) => {
        const rawConfig = response?.data

        return mapExternalConfig(rawConfig)
      })
    },
  })
}

function serveStaticResources(server: Hono<any>) {
  if (import.meta.env.PROD) {
    server
      .use('/assets/*', compress(), serveStatic({ root: './dist/public' }))
      .use('/icons/*', compress(), serveStatic({ root: './dist/public' }))
      .use('/images/*', compress(), serveStatic({ root: './dist/public' }))
      .use('/js/*', compress(), serveStatic({ root: './dist/public' }))
      .use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))
      .use('/favicons/*', serveStatic({ root: './dist/public' }))
      .use('/manifest.json', serveStatic({ path: './dist/public/manifest.json' }))
  } else {
    server
      .use('/icons/*', serveStatic({ root: './public' }))
      .use('/images/*', serveStatic({ root: './public' }))
      .use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }))
      .use('/favicons/*', serveStatic({ root: './public' }))
      .use('/manifest.json', serveStatic({ path: './public/manifest.json' }))
  }
}

export function defineServer(config: ServerConfig): Hono {
  handleUncaughtNodeExceptions()
  const container = registry.get('root')

  const server = new Hono()

  serveStaticResources(server)

  const rootConfig = createRootConfig()
  container.register(RootConfigToken).toValue(rootConfig)

  if (config.prerenderConfig) {
    prerender.registerRoutes(server, config.prerenderConfig)
  }

  if (config.staticFiles) {
    config.staticFiles.forEach((file) => {
      server.use(file.route, serveStatic({ path: file.path }))
    })
  }

  server
    .use('/frontstorage/*', logger(), proxyRequest)
    .use('/storage/*', logger(), proxyRequest)
    .get('/robots.txt', handleRobotsRequest)
    .get('/sitemap.xml', handleSitemapRequest)
    .use('/api/*', logger(), mocksMiddleware, proxyRequest)
    .use('/proxy/*', logger(), mocksMiddleware, proxyRequest)

  if (config.routes) {
    config.routes(server)
  }

  const reqConfigMiddleware =
    rootConfig.renderingMode === 'ssr'
      ? createRequestWithExternalConfigBinding(createExternalConfigCache()!)
      : requestConfigBinding

  const appRequestMiddlewares: MiddlewareHandler[] = [
    provideRequestContext,
    provideCookiesService,
    reqConfigMiddleware,
    prerender.middlewares.rps,
    prerender.middlewares.handler,
    provideCoreEvents,
    provideRouterMiddleware(config.renderProps.records, config.renderProps.routes),
  ]

  if (config.middlewares) {
    appRequestMiddlewares.push(...config.middlewares)
  }

  server.get('*', ...appRequestMiddlewares, (c) => {
    return handleAppRequest({
      c,
      serverHandler: config.serverHandler,
      renderProps: config.renderProps,
    })
  })

  if (import.meta.env.PROD) {
    const port = config.port || rootConfig.port || 80
    serve(
      {
        port,
        fetch: server.fetch,
      },
      () => {
        console.log(`🚀 Server running at http://localhost:${port}`)
        if (config.prerenderConfig) {
          prerender.pregeneratePages()
        }
      }
    )
  }

  return server
}
