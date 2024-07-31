import type { Plugin, UserConfig } from 'vite'

import type { Config } from '../config.ts'
import { PLUGIN_NAMESPACE } from '../consts.ts'
import type { Router } from '../router.ts'
import type { Manifest } from '../ssr-manifest.ts'

export type ConfigPluginOpts = {
  config: Config
  manifest: Manifest<any>
}

export const configPlugin = ({ config }: ConfigPluginOpts): Plugin => {
  return {
    name: `${PLUGIN_NAMESPACE}:config`,

    enforce: 'pre',

    config() {
      return {
        appType: 'custom',
        ssr: {
          // Ensure core-ssr packages are processed by the vite pipeline so
          // that the virtual plugin works
          noExternal: [/@fp\/core-ssr/],
        },

        optimizeDeps: {
          // Exclude all virtual modules from the vite dep optimization
          exclude: ['virtual:n2m-manifest', 'virtual:n2m-routes'],
        },
      } satisfies UserConfig
    },

    configResolved(viteConfig) {
      config.root = viteConfig.root
      config.mode = viteConfig.mode
      config.basePath = viteConfig.base
    },
  }
}
