import { defineConfig } from 'tsup'

export default defineConfig({
  format: 'esm',
  sourcemap: true,
  clean: true,
  external: [/^(?!~\/)(^[^./]|^\.[^./]|^\.\.[^/])/],
  entry: ['src/index.ts'],
})
