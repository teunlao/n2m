import { Context } from 'hono'

const pathMap: Record<string, string> = {
  api: 'api',
}

const replacePath = (path: string) => {
  Object.keys(pathMap).forEach((key) => {
    if (path.includes(key)) {
      path = path.replace(key, pathMap[key])
    }
  })
  return path
}

export const proxyRequest = async (c: Context) => {
  const baseURL =
    process.env?.BACKEND_URL ??
    process?.env?.VITE_BACKEND_URL ??
    import.meta.env.VITE_BACKEND_URL ??
    import.meta.env.VITE_PAYLOAD_URL ??
    `https://${c.req.raw.headers.get('host')}`

  console.log('new baseURL', baseURL)

  // @ts-expect-error ignore
  const queryParams = new URLSearchParams(c.req.queries()).toString()

  const url = new URL(baseURL + replacePath(c.req.path))
  url.search = queryParams

  try {
    const headers = {
      ...Object.fromEntries(c.req.raw.headers),
      'accept-encoding': 'gzip;q=0,deflate;q=0,br;q=1.0,*;q=0.1',
      host: url.host,
    }

    let options: {
      headers: { [p: string]: string }
      method: string
      body?: string
    } = {
      headers,
      method: c.req.method,
    }
    if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
      let body = undefined
      const contentType = c.req.raw.headers.get('content-type') || c.req.raw.headers.get('Content-Type')
      if (contentType?.includes('application/json')) {
        try {
          body = await c.req.json()
          if (body) {
            options = {
              ...options,
              body: JSON.stringify(body),
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
      if (contentType?.includes('multipart/form-data')) {
        // @ts-ignore
        delete headers['content-length']
        // @ts-ignore
        delete headers['content-type']
        try {
          options = {
            ...options,
            // @ts-ignore
            body: await c.req.formData(),
          }
        } catch (e) {
          console.log(e)
        }
      }
    }

    const response = await fetch(url.toString(), options)

    const responseHeaders = { ...Object.fromEntries(response.headers), 'proxy-by': 'hono.js' }

    // if we proxying our server to our server itself we need to remove content-encoding to get the correct response
    if (responseHeaders['server'] === 'cloudflare') {
      delete responseHeaders['content-encoding']
    }

    if (import.meta.env.DEV) {
      // console.log('[proxy request] to: ', url.href)
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (e: any) {
    console.log(e)
    return c.json({ message: `Proxy server: ${e?.message || 'error'}` }, { status: 500 })
  }
}
