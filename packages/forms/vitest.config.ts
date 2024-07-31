import { defineConfig } from 'vitest/config'
import React from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [React()],
  test: {
    environment: 'jsdom',
  },
})
