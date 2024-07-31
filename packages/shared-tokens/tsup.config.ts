import { defineConfig } from 'tsup'

export default defineConfig({
  format: 'esm',
  external: [/^(?!~\/)(^[^./]|^\.[^./]|^\.\.[^/])/],
  sourcemap: true,
  clean: true,
  treeshake: true,
  entry: ['src/index.ts'],
})
