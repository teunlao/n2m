import { RequestConfig } from '../server'
import { ConfigBuilder } from '../core/ConfigBuilder.ts'
import { useCookies } from '@n2m/cookies'
import { getLanguageFromString } from "@n2m/shared-utils";

export function requestConfigFactory() {
  const serverConfig = ConfigBuilder.parse(JSON.stringify(window.__STORE__?.config ?? '{}')) ?? {} as RequestConfig
  console.log('serverConfig', serverConfig)

  const clientConfig = new ConfigBuilder()
    .addOption('isServer', { defaultValue: false })
    .addOption('isClient', { defaultValue: true })
    .addOption('forwardUrl', { defaultValue: new URL(location.origin) })
    .addOption('isTelegramMiniApp', {
      transform: () => {
        // @ts-ignore window access
        return serverConfig.isTelegramMiniApp || !!window.TelegramWebviewProxy
      },
    })
    .addOption('language', {
      defaultValue: 'en',
      transform: (value) => {
        const langFromCookie = useCookies().get('i18n_redirected')
        const langFromNavigator = navigator.language
        const lang = langFromCookie || langFromNavigator || serverConfig.language || value
        return getLanguageFromString(lang)
      },
    })
    .addOption('intercomAppId', {
      envKey: 'INTERCOM_APP_ID',
      defaultValue: serverConfig.intercomAppId,
      transform: (value, { isTelegramMiniApp }): string => {
        if (!value && isTelegramMiniApp) {
          // default intercom app id for telegram mini app
          return 'touhgm6n'
        }

        return value as string
      },
    })
    .build()

  const resultConfig = { ...serverConfig, ...clientConfig }

  window.__STORE__.config = resultConfig

  return resultConfig
}
