import { type Context } from 'hono'

const getRobotsText = (host: string) => `
User-agent: *

Disallow: *?

Allow: /*.svg

Allow: /*.png

Allow: /*.jpg

Allow: /*.js

Allow: /*.css


User-agent: Yandex

Disallow: *?

Sitemap: https://${host}/sitemap.xml
`

export function handleRobotsRequest(context: Context) {
  const hostname = context.req.raw.headers.get('x-forwarded-host')! || context.req.raw.headers.get('host')!
  return new Response(getRobotsText(hostname), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
