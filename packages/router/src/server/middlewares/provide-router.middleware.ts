import { RouteInstance, UnmappedRouteObject } from '../../core'
import { provideRouter } from '../../shared/router-provider.tsx'
import { createMiddleware } from 'hono/factory'

export const provideRouterMiddleware = (
  records: UnmappedRouteObject<any>[],
  routes: Record<string, RouteInstance<any>>
) =>
  createMiddleware(async (_, next) => {
    provideRouter(records, routes)
    return await next()
  })
