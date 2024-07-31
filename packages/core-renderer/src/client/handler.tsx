import type { Simplify } from 'type-fest'

import { useScopedContainer } from '@n2m/core-di'
import { bootstrapModules } from '@n2m/core-modules'
import { UniversalContextToken } from '@n2m/shared-tokens'
import { type BaseRequestContext, createBaseRequestContext } from '../core/base-context.ts'
import { createCommonHooks, processPluginsClient, splitPluginsByPriority } from '../core/plugins.ts'
import type { ClientHandlerFn, ClientHandlerOpts, Config, RenderPlugin, ServerHandlerFn } from '../types.ts'

export function createApp<P extends RenderPlugin<any>[]>({
  RootLayout,
  appRenderer,
  plugins,
  modules,
}: ClientHandlerOpts<P>) {
  const ctx = undefined as unknown as ExtractPluginsAppContext<P> & BaseRequestContext

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const req = new Request(`${window.location.pathname}${window.location.search}`)

  const serverHandler = (() => {
    throw new Error(
      'The server handler should not be called on the client. Something is wrong, make sure you are not calling `appHandler.server()` in code that is included in the client.'
    )
  }) as ServerHandlerFn

  const clientHandler: ClientHandlerFn = async ({ renderProps = {} } = {}) => {
    const appCtx = createBaseRequestContext({ req })
    const container = useScopedContainer()

    container?.register(UniversalContextToken).toValue(appCtx as any)

    const commonHooks = createCommonHooks()

    const [beforeModulesPlugins, afterModulesPlugins] = splitPluginsByPriority(plugins ?? [])

    await processPluginsClient({ req, plugins: beforeModulesPlugins, ctx: appCtx, renderProps, container, commonHooks })

    bootstrapModules(modules ?? [], req)

    await processPluginsClient({ req, plugins: afterModulesPlugins, ctx: appCtx, renderProps, container, commonHooks })

    // @ts-expect-error ignore
    window.__DI_CONTAINER__ = container
    // @ts-expect-error ignore
    window.__DI_CONTAINER__.__uuid__ = UniversalContextToken

    let AppComp = appRenderer ? await appRenderer({ req, renderProps }) : undefined

    for (const fn of commonHooks.renderApp ?? []) {
      if (AppComp) {
        throw new Error('Only one plugin can implement app:render. app:wrap might be what you are looking for.')
      }

      AppComp = await fn()

      break
    }

    const wrappers: ((props: { children: () => Config['jsxElement'] }) => Config['jsxElement'])[] = []
    for (const fn of commonHooks.wrapApp ?? []) {
      // @ts-expect-error ignore
      wrappers.push(fn())
    }

    const renderApp = () => {
      if (!AppComp) {
        throw new Error('No plugin implemented renderApp')
      }

      let finalApp: Config['jsxElement']
      if (wrappers.length) {
        const wrapFn = (w: typeof wrappers): Config['jsxElement'] => {
          const [child, ...remainingWrappers] = w

          if (!child) return AppComp!()

          return child({ children: () => wrapFn(remainingWrappers) })
        }

        finalApp = wrapFn(wrappers)
      } else {
        finalApp = AppComp()
      }

      return RootLayout ? RootLayout({ children: finalApp }) : finalApp
    }

    return renderApp
  }

  return {
    ctx,
    serverHandler,
    clientHandler,
  }
}

/**
 * Have to duplicate these extract types in client and server entry, or downstream packages don't work correctly
 */

type Flatten<T> = {
  [K in keyof T]: T[K] extends object ? T[K] : never
}[keyof T]

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type ExtractPluginsAppContext<T extends RenderPlugin<any>[]> = Simplify<
  UnionToIntersection<
    Flatten<{
      [K in T[number]['id']]: ExtractPluginAppContext<T, K>
    }>
  >
>

type ExtractPluginAppContext<T extends RenderPlugin<any>[], K extends T[number]['id']> = ExtractGenericArg1<
  Extract<T[number], { id: K }>
>

type ExtractGenericArg1<T> = T extends RenderPlugin<infer X> ? X : never
