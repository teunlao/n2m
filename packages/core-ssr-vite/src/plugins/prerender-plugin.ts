import type { Plugin } from 'vite'
import { PLUGIN_NAMESPACE } from '../consts.ts'
import { processPages } from '@n2m/core-prerender/generator'
import { join } from 'path'
import { Head } from '@unhead/schema'

export type Entry = {
  path: string
  csr: boolean
  ssg: boolean
  head?: {
    ru: Head
    en: Head
  }
}

export type SsgPluginOptions = {
  entries: Entry[]
}

export const prerenderPlugin = ({ entries }: SsgPluginOptions): Plugin => {
  return {
    name: `${PLUGIN_NAMESPACE}:prerender`,
    apply: 'build',
    closeBundle: {
      order: 'post',
      async handler() {
        if (!entries.length) {
          process.exit(0)
        }
        if (process.argv.includes('--ssr')) {
          const serverPath = join(process.cwd(), 'dist', 'server.js')
          const port = 9999
          process.env.PORT = String(port)

          console.log('Starting server for page generating...')
          await import(serverPath)
          const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
          await wait(1000)

          try {
            try {
              await processPages({
                baseUrl: `http://localhost:${port}`,
                entries,
              })
              console.log('Pages generated successfully!')
            } catch (e) {
              console.error('Error generating pages:', e)
            }

            process.exit(0)
          } catch (error) {
            console.error('Error starting server:', error)
            process.exit(1)
          }
        }
      },
    },
  }
}
