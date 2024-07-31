import { Context } from 'hono'
import type { ServerHandlerFn } from '@n2m/core-renderer'
import { handleAppResponseErrors } from '../../api'

export type ResponseHeaders = Record<string, string>

interface RequestHandlerParams {
  c: Context
  serverHandler: ServerHandlerFn
  headers?: ResponseHeaders
  renderProps?: {
    routes: {
      [key: string]: any
    }
    records: any[]
    RoutesView: any
  }
}

export const createDefaultAppResponseHeaders = () => {
  const HEADER_CACHE_CONTROL_ENABLED = !!process.env.HEADER_CACHE_CONTROL_ENABLED
  const HEADER_CACHE_CONTROL_VALUE =
    process.env.HEADER_CACHE_CONTROL_VALUE ?? 'public, s-maxage=10, stale-while-revalidate=59'

  return {
    'Content-Type': 'text/html',
    ...(HEADER_CACHE_CONTROL_ENABLED && {
      'Cache-Control': HEADER_CACHE_CONTROL_VALUE,
    }),
  }
}

// We need to use `getInfraUrl` to get the correct URL for the request in the production environment.
export function getInfraUrl(c: Context) {
  if (import.meta.env.DEV) {
    return c.req.url
  }

  const xForwardedProto = c.req.raw.headers.get('x-forwarded-proto')
  const xForwardedHost = c.req.raw.headers.get('x-forwarded-host')
  const hostOrigin = c.req.raw.headers.get('host-origin')
  const host = c.req.raw.headers.get('host')

  const actualHost = xForwardedHost ?? hostOrigin ?? host

  const { pathname, search } = new URL(c.req.url)

  if (actualHost && xForwardedProto) {
    return `${xForwardedProto}://${actualHost}${pathname}${search}`
  }

  return c.req.url
}

async function handleAppRequest({ c, renderProps, serverHandler, headers }: RequestHandlerParams) {
  if (c.req.path.includes('/api')) {
    return c.json(
      {
        message: 'API path was requested in App handler',
      },
      {
        status: 404,
      }
    )
  }

  try {
    const { stream, statusCode } = await serverHandler({
      res: c.res,
      req: new Request(getInfraUrl(c), c.req.raw),
      renderProps,
    })

    return new Response(stream, {
      status: statusCode(),
      headers: { ...createDefaultAppResponseHeaders(), ...headers },
    })
  } catch (err: any) {
    return handleAppResponseErrors(err, c)
  }
}

export { handleAppRequest }
