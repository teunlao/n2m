import type { n2m } from './namespace.ts'
import React from 'react'
import { StreamInjectorHooks } from '@n2m/core-ssr-streaming'
import { Container } from '@n2m/core-di'

type ConfigBuiltIn = {
  jsxElement: unknown
}

export type Config = ConfigBuiltIn & n2m.Config

export type RenderToStreamFn<O extends object = object> = (props: {
  app: () => Config['jsxElement']
  req: Request
  injectToStream?: StreamInjectorHooks | StreamInjectorHooks[]
  shell?: string
  opts?: O
}) => Promise<{ stream: ReadableStream; statusCode: () => number }>

export type ServerRenderer = {
  renderToStream: RenderToStreamFn
}

type BaseHandlerOpts = {
  RootLayout?: null | false | ((props: { children: Config['jsxElement'] }) => Config['jsxElement'])
  renderProps: {
    records: any[]
    routes: Record<string, any>
  }
  shell?: Function
  appRenderer?: (props: {
    req: Request
    renderProps: n2m.RenderProps | {}
    meta?: n2m.ReqMeta
  }) => (() => Config['jsxElement']) | Promise<() => Config['jsxElement']>
}

export type ClientHandlerOpts<P extends RenderPlugin<any>[]> = BaseHandlerOpts & {
  plugins?: P
  modules?: Array<Function>
}

export type ClientHandlerFn = (props?: { renderProps?: n2m.RenderProps }) => Promise<() => Config['jsxElement']>

export type ServerHandlerOpts<P extends RenderPlugin<any>[]> = BaseHandlerOpts & {
  renderer: ServerRenderer
  plugins?: P
  modules: Array<Function>
}

export type ServerHandlerFn = (props: {
  res: Response
  req: Request
  renderProps?: n2m.RenderProps
  meta?: n2m.ReqMeta
}) => Promise<{ stream: ReadableStream<Uint8Array>; statusCode: () => number }>

export type CommonHooks<AC extends Record<string, unknown> = Record<string, unknown>> = {
  /**
   * Extend the app ctx object with additional properties. The app ctx object is made available
   * to the end application on the server and the client, and to subsequent plugins.
   */
  extendCtx?: () => AC

  /**
   * Wrap the app component with a higher-order component. This is useful for wrapping the app with providers, etc.
   */
  wrapApp?: () => (props: { children: () => React.ReactNode }) => React.ReactNode

  /**
   * Render the final inner-most app component. Only one plugin may do this - usually a routing plugin.
   */
  renderApp?: () => (() => Config['jsxElement']) | Promise<() => Config['jsxElement']>
}

export type ServerHooks = StreamInjectorHooks

export type RenderPlugin<AC extends Record<string, unknown>> = {
  id: Readonly<string>
  mode?: Readonly<'client' | 'server'>
  priority?: Readonly<'after_modules' | 'before_modules'>
  hooksForReq?: (props: {
    res?: Response
    req: Request
    meta?: n2m.ReqMeta
    ctx: Record<string, any>
    container: Container
    renderProps: {
      records: {
        path: string
        route: any
      }[]
      routes: Record<string, any>
      RoutesView: any
    }
  }) =>
    | null
    | {
        enabled?: boolean
        common?: CommonHooks<AC>
        server?: ServerHooks
      }
    | Promise<null | {
        enabled?: boolean
        common?: CommonHooks<AC>
        server?: ServerHooks
      }>
}

/**
 * Some types useful to downstream consumers.
 */
export type { SetOptional } from 'type-fest'
