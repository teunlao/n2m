import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties'],
        },
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    lib: {
      entry: [resolve(__dirname, 'src/index.ts')],
      formats: ['es'],
    },
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      external: [/^(?!~\/)(^[^./]|^\.[^./]|^\.\.[^/])/],
    },
  },
})
