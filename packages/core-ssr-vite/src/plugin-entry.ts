import type { PluginOption } from 'vite'

import { Config } from './config.ts'
import { buildPlugin } from './plugins/build.ts'
import { configPlugin } from './plugins/config.ts'
import { devServerPlugin } from './plugins/dev-server.ts'
import { emptyModulesPlugin } from './plugins/modules.ts'
import { virtualPlugin } from './plugins/virtual.ts'
import type { RouterAdapter } from './router.ts'
import { Manifest } from './ssr-manifest.ts'
import type { ServerRuntime } from './types.ts'
import versioningPlugin from './plugins/versioning.ts'
import { svgSpritePlugin } from './plugins/svg-sprite.ts'
import { type Entry, prerenderPlugin } from './plugins/prerender-plugin.ts'

export type Opts = {
  routerAdapter?: RouterAdapter<any>
  clientEntry?: string
  serverFile?: string
  prerenderEntries?: Entry[]
  clientOutDir?: string
  serverOutDir?: string
  runtime?: ServerRuntime
}

export { defaultRouterAdapter } from './default-router-adapter.ts'

export const n2mPlugin = ({
  clientEntry = 'src/entry.client.tsx',
  serverFile = 'src/server.ts',
  prerenderEntries = [],
  runtime = 'node',
  clientOutDir,
  serverOutDir,
}: Opts = {}): PluginOption[] => {
  const config = new Config({
    clientEntry,
    serverFile,
    clientOutDir,
    serverOutDir,
    runtime
  })

  const manifest = new Manifest({
    config,
  })

  globalThis.MANIFEST = manifest

  return [
    configPlugin({ config, manifest }),
    versioningPlugin(),
    emptyModulesPlugin(),
    virtualPlugin({ config, manifest }),
    devServerPlugin({ config, manifest }),
    buildPlugin({ config, manifest }),
    svgSpritePlugin({ config, manifest }),
    prerenderPlugin({ entries: prerenderEntries }),
  ].filter(Boolean)
}
