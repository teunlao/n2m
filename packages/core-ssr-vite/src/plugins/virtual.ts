import type { Plugin } from 'vite'

import type { Config } from '../config.ts'
import { PLUGIN_NAMESPACE } from '../consts.ts'
import type { Router } from '../router.ts'
import type { Manifest } from '../ssr-manifest.ts'

export type VirtualPluginOpts = {
  config: Config
  manifest: Manifest<any>
}

export const virtualPlugin = ({ manifest }: VirtualPluginOpts): Plugin => {
  const prefix = /^virtual:n2m-/

  const loadVirtualModule = (virtual: string) => {
    // if (virtual === 'routes') {
    //   return `export default ${JSON.stringify(router.routes)}`
    // }

    if (virtual === 'manifest') {
      return `export default ${JSON.stringify(manifest.ssrManifest)}`
    }

    if (virtual === 'css-modules') {
      return `export default ${JSON.stringify(manifest.cssModules)}`
    }

    return null
  }

  return {
    name: `${PLUGIN_NAMESPACE}:virtual`,

    enforce: 'pre',

    resolveId(id) {
      const [, virtual] = id.split(prefix)
      if (virtual) {
        return id
      }

      return
    },

    load(id) {
      const [, virtual] = id.split(prefix)

      if (virtual) {
        const mod = loadVirtualModule(virtual)
        if (!mod) {
          new Error(`Unknown virtual module: ${id}`)
        }

        return mod
      }

      return
    },
  }
}
