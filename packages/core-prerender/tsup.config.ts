import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    generator: 'src/generator/index.ts',
    injector: 'src/string-injector/index.ts',
  },
  format: 'esm',
  sourcemap: true,
  clean: true,
  external: [/^(?!~\/)(^[^./]|^\.[^./]|^\.\.[^/])/],
})
