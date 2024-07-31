import type { AssetHtmlTag } from '@n2m/core-ssr-vite/runtime'
import { ASSETS_PLUGIN_ID, defineRenderPlugin } from '../common.ts'

export type AssetsPluginCtx = {
  headAssets: AssetHtmlTag[]
  bodyAssets: AssetHtmlTag[]
}

export const assetsPlugin = () => {
  return defineRenderPlugin({
    id: ASSETS_PLUGIN_ID,

    hooksForReq: async ({ req }) => ({
      enabled: true,
      server: await injectAssetsToStream({ req }),
    }),
  })
}

export const injectAssetsToStream = async ({ req }: { req: Request }) => {
  const { assetsForRequest, renderAssetsToHtml } = await import('@n2m/core-ssr-vite/runtime')

  const assets = await assetsForRequest(req.url)

  return {
    emitToDocumentHead: () => renderAssetsToHtml(assets.headAssets),
    emitToDocumentBody: () => renderAssetsToHtml(assets.bodyAssets),
  }
}
