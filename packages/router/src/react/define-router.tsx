import { createRoute } from '../core'
import React from 'react'
import { createRoutesView } from './create-routes-view.tsx'
import { R } from '@n2m/shared-utils'

type Route = ReturnType<typeof createRoute>

export interface RouteDefinition {
  route: Route
  view: React.ComponentType
  layout?: React.FC<{ children: React.ReactNode }>
  path: string
}

export type RouteDefinitions<T extends Record<string, RouteDefinition> = {}> = T

export type RouteInstances<T extends Record<string, RouteDefinition> = {}> = {
  [K in keyof T]: Route
}

export type RouterOptions<T extends Record<string, RouteDefinition> = {}> = {
  otherwise: React.ComponentType
  rootLayout: React.FC<{ children: React.ReactNode }>
  routes: RouteDefinitions<T>
}

export type RouterResult<T extends Record<string, RouteDefinition>> = {
  RoutesView: React.ComponentType
  routes: RouteInstances<T>
  records: { path: string; route: Route }[]
}

export function defineRouter<T extends Record<string, RouteDefinition> = {}>({
  routes,
  rootLayout,
  otherwise,
}: RouterOptions<T>): RouterResult<T> {
  const resultRoutes = R.mapValues(routes, (value) => (value as RouteDefinition).route) as RouteInstances<T>
  const resultRecords = R.values(routes)

  return {
    routes: resultRoutes,
    records: resultRecords,
    RoutesView: createRoutesView({
      rootLayout,
      routes: R.values(routes),
      otherwise,
    }),
  }
}
