import { LoadableCache } from '@n2m/cache'
import { injectDependency } from '@n2m/core-di/next'
import { registry } from '@n2m/core-di/next'
import { ShellInjectorHooksToken } from '@n2m/shared-tokens'
import { createMiddleware } from 'hono/factory'
import { createRequestConfig, ResultConfig } from '../../server'
import { RequestConfigToken } from '../../shared'
import { ConfigBuilder } from '../../core/ConfigBuilder.ts'
import { createExternalConfig } from '../../shared'

export const requestConfigBinding = createMiddleware(async (c, next) => {
  const shellInjectorHooks = injectDependency(ShellInjectorHooksToken)
  const container = registry.get('root')
  const requestConfig = createRequestConfig(c)

  shellInjectorHooks.push({
    emitToDocumentBody() {
      return `
        <script>
          window.__STORE__ = window.__STORE__ || {}
          window.__STORE__.config = ${ConfigBuilder.serialize(requestConfig)}
        </script>
      `
    },
  })

  container.register(RequestConfigToken).toValue(requestConfig as ResultConfig)

  return await next()
})

export function createRequestWithExternalConfigBinding(externalConfigCache: LoadableCache<Record<string, any>>) {
  return createMiddleware(async (c, next) => {
    const shellInjectorHooks = injectDependency(ShellInjectorHooksToken)

    const requestConfig = createRequestConfig(c)
    await externalConfigCache.waitForDataResolved()
    const externalConfigRawData = externalConfigCache.getData()
    const externalConfig = createExternalConfig(externalConfigRawData ?? {})

    const resultedConfig = {
      ...requestConfig,
      ...externalConfig,
      isExternalConfigLoaded: !!externalConfigRawData,
      __serializeOptions: {
        // @ts-expect-error internal field
        ...requestConfig.__serializeOptions,
        // @ts-expect-error internal field
        ...externalConfig.__serializeOptions,
        isExternalConfigLoaded: { serialize: true },
      },
    }

    shellInjectorHooks.push({
      emitToDocumentBody() {
        return `
        <script>
          window.__STORE__ = window.__STORE__ || {}
          window.__STORE__.config = ${ConfigBuilder.serialize(resultedConfig)}
        </script>
      `
      },
    })

    return await next()
  })
}
