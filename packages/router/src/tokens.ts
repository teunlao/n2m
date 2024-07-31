import { createHistoryRouter } from './core'
import { createToken } from '@n2m/core-di'
import { type BrowserHistory } from 'history'
import { RouteInstances } from './react'

export type IRouter = ReturnType<typeof createHistoryRouter>

export const RouterToken = createToken<IRouter>('Router')
export const RoutesToken = createToken<RouteInstances>('Routes')
export const HistoryToken = createToken<BrowserHistory>('History')
