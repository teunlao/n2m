import type { RedirectStatusCode } from 'hono/utils/http-status'
import { type Context } from 'hono'

export const handleAppResponseErrors = (err: Error, c: Context) => {
  console.error('Error in app response:', err)
  /**
   * Handle react-router redirects
   */
  if (err instanceof Response && err.status >= 300 && err.status <= 399) {
    return c.redirect(err.headers.get('Location') || '/', err.status as RedirectStatusCode)
  }

  return new Response(
    JSON.stringify({
      error: 'Internal Server Error',
      node_version: process.version,
      commit_sha: import.meta.env.VITE_VERSION,
      url: c.req.url,
      message: err.message,
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
