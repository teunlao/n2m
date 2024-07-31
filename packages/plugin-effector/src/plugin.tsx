import { defineRenderPlugin } from '@n2m/core-renderer'
import { Provider as EffectorScopeProvider } from 'effector-react'
import { allSettled, fork, type Scope, scopeBind, serialize } from 'effector'
import { useRouter } from '@n2m/router'
import { Suspense } from 'react'
import { useConfig } from '@n2m/core-config/shared'
import { useScopedContainer } from '@n2m/core-di'
import { CurrentEffectorScopeToken, useCoreEvents } from '@n2m/adapter-effector'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { combineEvents } from 'patronum'

export const PLUGIN_ID = 'effector' as const

export const effectorPlugin = () => {
  return defineRenderPlugin({
    priority: import.meta.env.SSR ? 'after_modules' : 'after_modules',
    id: PLUGIN_ID,
    hooksForReq: async ({ renderProps }) => {
      let scope: Scope

      const { isClient, requestUrl } = useConfig()
      const { appStarted, ssrStarted } = useCoreEvents()

      const { RoutesView } = renderProps

      if (isClient) {
        scope = useScopedContainer().resolve(CurrentEffectorScopeToken)

        const history = createBrowserHistory({ window })
        scopeBind(useRouter().setHistory, { scope })(history)
        scopeBind(appStarted, { scope })()
      } else {
        scope = fork()
        useScopedContainer().register(CurrentEffectorScopeToken).toValue(scope)

        const history = createMemoryHistory({
          initialEntries: [requestUrl.pathname + requestUrl.search],
          initialIndex: 0,
        })

        scopeBind(useRouter().setHistory, { scope })(history)

        await allSettled(ssrStarted, { scope })
      }

      return {
        enabled: true,
        common: {
          wrapApp: () => {
            return ({ children }) => <EffectorScopeProvider value={scope}>{children()}</EffectorScopeProvider>
          },
          renderApp: () => {
            return () => (
              <Suspense>
                <RoutesView />
              </Suspense>
            )
          },
        },

        server: {
          emitToDocumentBody: async () => {
            const storesValues = serialize(scope)

            console.log('storesValues', storesValues)
            return `<script>window.__effectorStores = ${JSON.stringify(storesValues)}</script>`
          },
        },
      }
    },
  })
}
