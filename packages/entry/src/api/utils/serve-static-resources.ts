import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { serveStatic } from '@hono/node-server/serve-static'

export function serveStaticResources(server: Hono<any>) {
  if (import.meta.env.PROD) {
    server
      .use('/assets/*', compress(), serveStatic({ root: './dist/public' }))
      .use('/icons/*', compress(), serveStatic({ root: './dist/public' }))
      .use('/images/*', compress(), serveStatic({ root: './dist/public' }))
      .use('/js/*', compress(), serveStatic({ root: './dist/public' }))
      .use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))
      .use('/favicons/*', serveStatic({ root: './dist/public' }))
      .use('/manifest.json', serveStatic({ path: './dist/public/manifest.json' }))
  } else {
    server
      .use('/icons/*', serveStatic({ root: './public' }))
      .use('/images/*', serveStatic({ root: './public' }))
      .use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }))
      .use('/favicons/*', serveStatic({ root: './public' }))
      .use('/manifest.json', serveStatic({ path: './public/manifest.json' }))
  }
}
