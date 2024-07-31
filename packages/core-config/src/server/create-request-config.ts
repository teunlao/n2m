import { injectDependency } from '@n2m/core-di'
import { RootConfigToken } from '../shared'
import { type Context } from 'hono'
import { PageGenerationMode, RenderingMode } from '../types.ts'
import { ConfigBuilder } from '../core/ConfigBuilder.ts'
import { useCookies } from '@n2m/cookies'

export function createRequestConfig(c: Context) {
  const rootConfig = injectDependency(RootConfigToken)

  const { isProd } = rootConfig

  const config = new ConfigBuilder()
    .addOption('renderingModeByHeader', { defaultValue: c.req.raw.headers.get('x-rendering-mode') })
    .addOption('renderingModeByShell', { defaultValue: c.req.query('shell') })
    .addOption('pageGenerationMode', {
      transform: () => (c.req.raw.headers.get('x-generate') as PageGenerationMode) ?? 'none',
    })
    .addOption('requestUrl', {
      transform: (): URL => {
        const url = new URL(c.req.url)

        if (import.meta.env.DEV) {
          return url
        }

        const xForwardedProto = c.req.raw.headers.get('x-forwarded-proto')
        const xForwardedHost = c.req.raw.headers.get('x-forwarded-host')
        const hostOrigin = c.req.raw.headers.get('host-origin')
        const host = c.req.raw.headers.get('host')

        const actualHost = xForwardedHost ?? hostOrigin ?? host

        const { pathname, search } = url

        if (actualHost && xForwardedProto) {
          return new URL(`${xForwardedProto}://${actualHost}${pathname}${search}`)
        }

        return url
      },
    })
    .addOption('backendUrl', {
      envKey: 'BACKEND_URL',
      fallbackEnvKey: 'VITE_BACKEND_URL',
      defaultValue: null as unknown as URL,
      transform: (envValue, { requestUrl }) => new URL(envValue ?? requestUrl),
    })
    .addOption('forwardUrl', {
      defaultValue: '' as unknown as URL,
      transform: (_, { backendUrl, requestUrl }): URL => {
        if (isProd) {
          return backendUrl
        }

        return requestUrl
      },
    })
    .addOption('renderingMode', {
      defaultValue: rootConfig.renderingMode,
      transform: (value, { renderingModeByHeader, renderingModeByShell, isTelegramMiniApp, requestUrl }) => {
        const allowedRenderingModes = ['ssr', 'ssg', 'csr', 'default']
        let renderingMode = value
        if (!allowedRenderingModes.includes(renderingMode!)) {
          renderingMode = 'default'
        }

        if (renderingMode === 'default') {
          renderingMode = renderingModeByHeader ?? renderingModeByShell ?? 'ssr'
        }

        if (isTelegramMiniApp) {
          renderingMode = 'csr'
        }

        const authCookie = useCookies().get('auth', JSON.parse) ?? {}
        const tokenExpiresTimestamp = authCookie.expiresAt ? new Date(authCookie.expiresAt).getTime() : null
        const isAuthorized = !!(authCookie.accessToken && tokenExpiresTimestamp && Date.now() < tokenExpiresTimestamp)

        if (isAuthorized && renderingMode === 'ssg') {
          renderingMode = 'ssr'
        }

        // let filePrefix = requestUrl.pathname.replace(/\//g, '--')
        // if (filePrefix === '--') filePrefix = '--_' // TODO for assert that we found right root path, should fix in future to Index path
        //
        // const htmlGenPath = path.join(process.cwd(), 'dist', 'html-gen')
        // const renderModeGenPath = path.join(htmlGenPath, renderingMode ?? '')
        //
        // if (!fs.existsSync(renderModeGenPath)) {
        //   return 'ssr'
        // }
        //
        // const isPageExist = fs
        //   .readdirSync(renderModeGenPath)
        //   .filter((file) => file.startsWith(filePrefix) && file.endsWith('.html')).length
        //
        // if (!isPageExist) {
        //   return 'ssr'
        // }

        return renderingMode as RenderingMode
      },
    })
    .addOption('headers', {
      transform: (): Headers => {
        const headers = Object.fromEntries(c.req.raw.headers)
        delete headers['cookie']
        return new Map(Object.entries(headers)) as unknown as Headers
      },
      serialize: false,
    })
    .addOption('isLocal', {
      transform: (_, { requestUrl }): Boolean => {
        return requestUrl.host.startsWith('localhost')
      },
    })
    .addOption('language', {
      defaultValue: 'en',
      transform: (value, { headers }) => {
        const langFromCookie = useCookies().get('i18n_redirected')
        const langFromHeader = headers.get('accept-language')?.slice(0, 2)
        return langFromCookie || langFromHeader || (value as string)
      },
    })
    .build()

  return {
    ...rootConfig,
    ...config,
    __serializeOptions: {
      // @ts-expect-error internal field
      ...rootConfig.__serializeOptions,
      // @ts-expect-error internal field
      ...config.__serializeOptions,
    },
  } as typeof config & typeof rootConfig
}

export type RequestConfig = ReturnType<typeof createRequestConfig>
