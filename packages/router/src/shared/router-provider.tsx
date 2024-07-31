import { createHistoryRouter, UnmappedRouteObject } from '../core'
import { injectDependency, useScopedContainer } from '@n2m/core-di'
import { HistoryToken, RouterToken, RoutesToken } from '../tokens.ts'
import { RouteInstances } from '../react'

export function provideRouter(records: UnmappedRouteObject<any>[], routes: RouteInstances) {
  const container = useScopedContainer()

  const router = createHistoryRouter({
    routes: records,
    hydrate: true,
  })

  container.register(RouterToken).toValue(router)

  provideRoutes(routes)
}

function provideRoutes(routes: RouteInstances) {
  const container = useScopedContainer()
  container.register(RoutesToken).toValue(routes)
}

export function useRouter(): ReturnType<typeof createHistoryRouter> {
  return injectDependency(RouterToken)
}

export function useHistory() {
  return injectDependency(HistoryToken)
}

export function useRoutes() {
  return injectDependency(RoutesToken)
}
