import { defineRenderPlugin } from '@n2m/core-renderer'
import { useConfig } from '@n2m/core-config/shared'

export const PLUGIN_ID = 'GtagPlugin' as const

type GtagPluginOptions = {
  id: string
}
export const gtagPlugin = ({ id }: GtagPluginOptions) => {
  return defineRenderPlugin({
    id: PLUGIN_ID,
    hooksForReq: ({ req }) => ({
      enabled: true,
      server: {
        emitToDocumentBody() {
          const { isLocal, isStage } = useConfig()
          if (!isLocal && !isStage) {
            return `
<script id="gtag" async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
</script>`
          }
        },
      },
    }),
  })
}
