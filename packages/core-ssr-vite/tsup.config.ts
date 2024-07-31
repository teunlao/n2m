import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/plugin-entry.ts', 'src/runtime/index.ts', 'src/plugins/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  clean: true,
  external: [/^[^./]/],
})
