import type { Simplify } from 'type-fest'

import { injectDependency, registry, useScopedContainer } from '@n2m/core-di'
import { bootstrapModules } from '@n2m/core-modules'
import { ShellInjectorHooksToken, UniversalContextToken } from '@n2m/shared-tokens'
import { createBaseRequestContext } from '../core'
import { createCommonHooks, createServerHooks, processPlugins, splitPluginsByPriority } from '../core/plugins.ts'
import type { ClientHandlerFn, Config, RenderPlugin, ServerHandlerFn, ServerHandlerOpts } from '../types.ts'

export function createApp<P extends RenderPlugin<any>[]>({
  RootLayout,
  shell,
  renderer,
  appRenderer,
  plugins,
  modules = [],
}: ServerHandlerOpts<P>) {
  registry.create('root')
  /**
   * Only for internal usage
   */
  const ctx = undefined as unknown as ExtractPluginsAppContext<P>

  const clientHandler = (() => {
    throw new Error(
      'The client handler should not be called on the server. Something is wrong, make sure you are not calling appHandler.client() in code that is included in the server.'
    )
  }) as ClientHandlerFn

  const serverHandler: ServerHandlerFn = async ({ req, res, meta, renderProps = {} }) => {
    const appCtx = createBaseRequestContext({ req })

    const commonHooks = createCommonHooks()
    const serverHooks = createServerHooks()

    const [beforeModulesPlugins, afterModulesPlugins] = splitPluginsByPriority(plugins ?? [])

    const container = useScopedContainer()
    container.register(UniversalContextToken).toValue(appCtx as any)

    await processPlugins({
      plugins: beforeModulesPlugins,
      req,
      res,
      meta,
      renderProps,
      ctx: appCtx,
      container,
      commonHooks,
      serverHooks,
    })

    bootstrapModules(modules, req)

    await processPlugins({
      plugins: afterModulesPlugins,
      req,
      res,
      meta,
      renderProps,
      ctx: appCtx,
      container,
      commonHooks,
      serverHooks,
    })

    async function createAppRenderer() {
      let AppComp = appRenderer ? await appRenderer({ req, meta, renderProps }) : undefined

      for (const fn of commonHooks.renderApp ?? []) {
        if (AppComp) {
          throw new Error('Only one plugin can implement app:render. app:wrap might be what you are looking for.')
        }

        AppComp = await fn()

        break
      }

      const decorators: ((props: { children: () => Config['jsxElement'] }) => Config['jsxElement'])[] = []
      for (const fn of commonHooks.wrapApp ?? []) {
        // @ts-expect-error ignore
        decorators.push(fn())
      }

      const renderApp = () => {
        if (!AppComp) {
          throw new Error('No plugin implemented renderApp')
        }

        let finalApp: Config['jsxElement']
        if (decorators.length) {
          const wrapFn = (w: typeof decorators): Config['jsxElement'] => {
            const [child, ...remainingDecorators] = w

            if (!child) return AppComp!()

            return child({ children: () => wrapFn(remainingDecorators) })
          }

          finalApp = wrapFn(decorators)
        } else {
          finalApp = AppComp()
        }

        return RootLayout ? RootLayout({ children: finalApp }) : finalApp
      }

      const baseInjectorHooks = injectDependency(ShellInjectorHooksToken)

      return renderer.renderToStream({
        app: renderApp,
        req,
        injectToStream: [...baseInjectorHooks, ...serverHooks],
        shell: shell?.(appCtx),
      })
    }
    /**
     * Run the rest of the hooks in storage scope, so we can access the container
     */
    return createAppRenderer()
  }

  return {
    ctx,
    clientHandler,
    serverHandler,
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
