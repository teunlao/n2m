import { History } from 'history'
import { Effect, Store, Event, EventCallable } from 'effector'
import { Meta } from '@n2m/shared-types'

export type RouteParams = Record<string, any>

export type RouteQuery = Record<string, any>

export type RouteParamsAndQuery<Params extends RouteParams> = {
  params: Params
  query: RouteQuery
}

export interface NavigateParams<Params extends RouteParams> extends RouteParamsAndQuery<Params> {
  replace?: boolean
}

export type RouteInstance<Params extends RouteParams> = {
  $isOpened: Store<boolean>
  $name: Store<string | null>
  $params: Store<Params>
  meta?: Meta
  $query: Store<RouteQuery>
  suspended: EventCallable<void>
  opened: Event<RouteParamsAndQuery<Params>>
  updated: Event<RouteParamsAndQuery<Params>>
  closed: Event<void>
  navigate: Effect<NavigateParams<Params>, NavigateParams<Params>>
  open: Effect<Params extends EmptyObject ? void : Params, RouteParamsAndQuery<Params>>
  kind: typeof Kind.ROUTE
  '@@unitShape': () => {
    isOpened: Store<boolean>
    name: Store<string | null>
    params: Store<Params>
    query: Store<RouteQuery>
  }
}

export interface RouteInstanceInternal<Params extends RouteParams> extends RouteInstance<Params> {
  opened: EventCallable<RouteParamsAndQuery<Params>>
  updated: EventCallable<RouteParamsAndQuery<Params>>
  closed: EventCallable<void>
}

export type RouteObject<Params extends RouteParams> = {
  route: RouteInstance<Params>
  path: string
}

export interface RouteObjectInternal<Params extends RouteParams> extends RouteObject<Params> {
  route: RouteInstanceInternal<Params>
}

export type UnmappedRouteObject<Params extends RouteParams> = {
  route: RouteInstance<Params> | RouteInstance<Params>[]
  path: string
}

export type HistoryPushParams = {
  history: History
  path: string
  params: RouteParams
  query: RouteQuery
  method: 'replace' | 'push'
}

export type HistoryBackForwardParams = History

export type ParamsSerializer = {
  write: (params: RouteParams) => string
  read: (query: string) => RouteParams
}

export type PathCreator<Params extends RouteParams> = string

export const Kind = {
  ROUTE: Symbol(),
}

export type EmptyObject = { [key in string]: never }
