import type { RenderToStreamFn } from '@n2m/core-renderer/server'
import { injectIntoStream } from '@n2m/core-ssr-streaming'
import isbot from 'isbot-fast'
import type { RenderToReadableStreamOptions } from 'react-dom/server'
import rd from 'react-dom/server'
import { renderToReadableStream as fallbackRenderToReadableStream } from 'react-dom/server.browser'

export const renderToStream: RenderToStreamFn<RenderToReadableStreamOptions> = async ({
  app,
  req,
  injectToStream,
  opts,
  shell,
}) => {
  let status = 200

  /**
   * Infuriatingly, react-dom/server does not include renderToReadableStream in the node production build.
   *
   * https://github.com/facebook/react/issues/26906
   *
   * This is a workaround to attempt to use the renderToReadableStream from the server build (in case it's resolves to something specific like bun's renderToReadableStream impl),
   * with a fallback to the implementation provided by the browser build. This is what we want in the case of node on the server, since we're targeting
   * node versions that support web streams.
   */
  const streamFn = rd.renderToReadableStream ?? fallbackRenderToReadableStream

  const originalStream = await streamFn(app(), {
    signal: req.signal,
    ...opts,
    onError(error, errorInfo) {
      console.error('Error while rendering the app shell', error)
      status = 500

      if (opts?.onError) {
        opts?.onError(error, errorInfo)
      }
    },
  })

  const stream = injectToStream ? injectIntoStream(req, originalStream, injectToStream, shell) : originalStream

  const ua = req.headers.get('user-agent')
  const isGoogle = ua?.toLowerCase().includes('googlebot') ?? false
  if (ua && !isGoogle && isbot(ua)) {
    await originalStream.allReady
  }

  return { stream, statusCode: () => status }
}
