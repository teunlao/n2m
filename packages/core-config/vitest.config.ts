import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'import.meta.env.MODE': 'TEST',
  },
  test: {
    environment: 'node',
  },
})
