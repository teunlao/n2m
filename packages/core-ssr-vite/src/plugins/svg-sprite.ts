import type { Plugin } from 'vite'
import { PLUGIN_NAMESPACE } from '../consts.ts'

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import type { Config } from '../config.ts'
import type { Manifest } from '../ssr-manifest.ts'

export type BuildPluginOpts = {
  config: Config
  manifest: Manifest<any>
}

function extractSvgName(path) {
  const regex = /\/(\w+(?:-\w+)*)\.svg$/
  const match = path.match(regex)
  return match ? match[1] : null
}

export const svgSpritePlugin = ({ config }: BuildPluginOpts): Plugin => {
  const filesContent = {}

  return {
    name: `${PLUGIN_NAMESPACE}:svg-sprite`,
    enforce: 'pre',
    buildStart() {
      const generateSprite = () => {
        const svgDir = path.resolve(config.root, 'public/icons')

        // TODO this is a workaround to exclude some files from the sprite
        const excludePattern = /vip-main-level/
        const files = glob.sync(path.join(svgDir, '**', '*.svg')).filter((file) => !excludePattern.test(file))

        files.forEach((file) => {
          try {
            const filePath = path.resolve(file)
            const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
            filesContent[extractSvgName(filePath)] = fileContent
          } catch (error) {
            console.error(`Error when processing file:  ${file}:`, error)
          }
        })
      }

      generateSprite()
    },
    load(id) {
      const [, virtual] = id.split(/^virtual:n2m-/)

      if (virtual === 'icons-sprite') {
        return `export default ${JSON.stringify(filesContent)}`
      }
    },
  }
}
