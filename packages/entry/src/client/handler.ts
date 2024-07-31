import {
  createApp as baseCreateApp,
  type ClientHandlerOpts,
  type RenderPlugin,
  type SetOptional,
} from '@n2m/core-renderer/client'

import { requestConfigFactory } from '@n2m/core-config/client'
import { RequestConfigToken, useConfig } from '@n2m/core-config/shared'
import { CookiesServiceToken } from '@n2m/cookies'
import { CookiesService } from '@n2m/cookies/client'
import { diDebug, registry, useScopedContainer } from '@n2m/core-di/next'
import { CurrentEffectorScopeToken, provideCoreEventsClient } from '@n2m/adapter-effector'
import { provideRouter } from '@n2m/router'
import { RootLayout } from '../default-root.tsx'
import { fork } from 'effector'

export function createApp<P extends RenderPlugin<any>[]>(opts: SetOptional<ClientHandlerOpts<P>, 'RootLayout'>) {
  const container = registry.create('root')

  const scope = fork({
    // @ts-expect-error
    values: window.__effectorStores,
  })
  useScopedContainer().register(CurrentEffectorScopeToken).toValue(scope)

  const { records, routes } = opts.renderProps

  container.register(CookiesServiceToken).toValue(new CookiesService())

  provideCoreEventsClient()
  const config = requestConfigFactory()
  // @ts-expect-error we mixed up with the config, so types are not compatible
  container.register(RequestConfigToken).toValue(config)
  // TODO fix types
  // @ts-ignore
  provideRouter(records, routes)

  return baseCreateApp({
    RootLayout,
    ...opts,
  })
}

export function redirectTgDomainToRedirector({
  tgDomain,
  redirectorDomain,
}: {
  tgDomain: string
  redirectorDomain: string
}) {
  const { isTelegramMiniApp } = useConfig()

  if (location.host === tgDomain) {
    if (!isTelegramMiniApp) {
      location.href = `https://${redirectorDomain}${location.pathname}${location.search}`

      return { redirected: true }
    }
  }

  return { redirected: false }
}
