import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { transform } from 'esbuild'
import { Plugin } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export const swVersionPlugin = (): Plugin => {
  return {
    name: 'vite-sw-plugin',
    enforce: 'pre',
    async buildStart() {
      async function runCommand(command: string, options = {}) {
        try {
          return execSync(command, options)?.toString()?.trim()
        } catch (error) {
          console.error(`Error when executing command ${command}:`, error)
          return ''
        }
      }

      const gitCommitHash = (await runCommand('git rev-parse HEAD')).substr(0, 7)

      const serviceWorkerPath = resolve(__dirname, '../src/plugins/sw-version-plugin/sw-version.ts')
      let code = readFileSync(serviceWorkerPath, 'utf8')

      code = code.replace('__GIT_COMMIT_HASH__', gitCommitHash ?? '')

      const result = await transform(code, {
        loader: 'ts',
        minify: false,
        target: 'es2017',
      })

      writeFileSync('./public/sw-version.js', result.code)
    },
  }
}
