import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/client/index.ts', 'src/server/index.ts', 'src/shared/index.ts', 'src/api/index.ts'],
  external: [/^(?!~\/)(^[^./]|^\.[^./]|^\.\.[^/])/],
  outDir: 'dist',
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  clean: true,
})
