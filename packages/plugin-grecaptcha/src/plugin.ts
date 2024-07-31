import { defineRenderPlugin } from '@n2m/core-renderer'
import { useScopedContainer } from '@n2m/core-di'
import { GreCaptchaToken } from './tokens.ts'
import { useConfig } from '@n2m/core-config/shared'

const PLUGIN_ID = 'grecaptcha' as const

export const greCaptchaPlugin = () => {
  return defineRenderPlugin({
    id: PLUGIN_ID,
    hooksForReq: () => {
      const { gSiteKey } = useConfig()
      const diContainer = useScopedContainer()
      const { isClient } = useConfig()
      if (isClient) {
        // @ts-expect-error
        diContainer.register(GreCaptchaToken, window.grecaptcha)
      }

      return {
        enabled: true,
        server: {
          emitToDocumentHead: () => {
            return `<script src="https://www.google.com/recaptcha/api.js?render=${gSiteKey}"></script>
            `
          },
        },
      }
    },
  })
}
