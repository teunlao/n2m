import { createApp } from '@n2m/entry'
import { renderProps } from './router.config.tsx'
import { assetsPlugin } from '@n2m/core-renderer/assets'
import { unheadPlugin } from '@n2m/plugin-unhead'
import { effectorPlugin } from '@n2m/plugin-effector'
import { chakraPlugin } from '@n2m/plugin-chakra'
import { system } from './theme/theme.ts'
import { articlesModule } from './modules/articles/articles.module.ts'
import { authModule } from './modules/auth/auth.module.ts'
import { layoutModule } from './modules/layout/layout.module.ts'

const { clientHandler, serverHandler } = createApp({
  renderProps,
  shell() {
    return `<!DOCTYPE html>
     <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
        <link rel="icon" type="image/svg" href="/favicons/favicon.svg">
        <link rel="manifest" href="/manifest.json">
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/favicon.svg">
        <link rel="shortcut icon" href="/favicons/favicon-32x32.png" sizes="32x32">
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>`
  },
  // prettier-ignore
  plugins: [
    assetsPlugin(),
    unheadPlugin(),
    chakraPlugin({ system, defaultColorMode: 'dark' }),
    effectorPlugin()
  ],
  // prettier-ignore
  modules: [
    authModule(),
    layoutModule(),
    articlesModule(),
  ],
})

export { clientHandler, serverHandler }
