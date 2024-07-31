import { n2mPlugin } from '@n2m/core-ssr-vite/plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { prerenderConfig } from './src/prerender.config.ts'

const removeDescriptionsBabelPlugin = function () {
  return {
    visitor: {
      CallExpression(path) {
        if (path.node.callee.name === 'invokeAction' && process.env.NODE_ENV === 'production') {
          path.node.arguments[0] = {
            type: 'StringLiteral',
            value: '',
          }
        }
      },
    },
  }
}

export default defineConfig(() => ({
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [removeDescriptionsBabelPlugin, ['effector/babel-plugin']],
      },
    }),
    n2mPlugin({
      serverFile: 'src/entry.server.ts',
      clientEntry: 'src/entry.client.tsx',
      prerenderEntries: prerenderConfig,
    }),
  ],
  build: {
    minify: true,
    cssMinify: true,
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
}))
