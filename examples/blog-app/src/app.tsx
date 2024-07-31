import { createApp } from '@n2m/entry'
import { renderProps } from './router.config.tsx'
import { assetsPlugin } from '@n2m/core-renderer/assets'
import { unheadPlugin } from '@n2m/plugin-unhead'
import { effectorPlugin } from '@n2m/plugin-effector'
import { chakraPlugin } from '@n2m/plugin-chakra'
import { system } from './theme/theme.ts'
import { ArticlesModule } from './modules/articles/articles.module.ts'
import { AuthModule } from './modules/auth/auth.module.ts'
import { LayoutModule } from './modules/layout/layoutModule.ts'
import { CommentsModules } from './modules/comments/comments.modules.ts'
import { CoordinatorModule } from './modules/coordinator/coordinator.module.ts'

const { clientHandler, serverHandler } = createApp({
  renderProps,
  shell() {
    return `<!DOCTYPE html>
     <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
        <link rel="manifest" href="/manifest.json">
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
    effectorPlugin(),
  ],
  // prettier-ignore
  modules: [
    AuthModule(),
    LayoutModule(),
    ArticlesModule(),
    CommentsModules(),
    CoordinatorModule()
  ],
})

export { clientHandler, serverHandler }
