import { defineRenderPlugin } from '@n2m/core-renderer'
import { useConfig } from '@n2m/core-config/shared'
import { UnheadPluginToken } from '@n2m/plugin-unhead'
import { useDependency } from '@n2m/shared-hooks'

export const PLUGIN_ID = 'GtmPlugin' as const

type GtmPluginOptions = {
  id: string
}
export const gtmPlugin = ({ id }: GtmPluginOptions) => {
  return defineRenderPlugin({
    id: PLUGIN_ID,
    mode: 'client',
    hooksForReq: () => {
      const { isLocal, isStage } = useConfig()
      const { useHead } = useDependency(UnheadPluginToken)
      if (!isLocal && !isStage) {
        useHead({
          script: [
            {
              innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',  '${id}' );`,
            },
          ],
          noscript: [
            {
              innerHTML:
                '<iframe src="https://www.googletagmanager.com/ns.html?id=${id}"\n height="0" width="0" style="display:none;visibility:hidden"></iframe>',
            },
          ],
        })
      }
      return {
        common: {},
      }
    },
  })
}
