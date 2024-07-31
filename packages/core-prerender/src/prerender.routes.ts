import { type Hono } from 'hono'
import { authorizedMiddleware } from './middlewares'
import { forceGarbageCollection, generateDashboard, generatePage, removePage, restartServer } from './controllers'
import type { PrerenderConfig } from './types.ts'

export function registerRoutes(server: Hono, prerenderConfig: PrerenderConfig) {
  globalThis.prerenderEntries = prerenderConfig
  server.get('/prerender/generate', authorizedMiddleware, generatePage)
  server.get('/prerender/remove', authorizedMiddleware, removePage)
  server.get('/prerender/manager', authorizedMiddleware, generateDashboard)
  server.get('/prerender/force-gc', authorizedMiddleware, forceGarbageCollection)
  import.meta.env.DEV && server.get('/dev/restart', restartServer)
}
