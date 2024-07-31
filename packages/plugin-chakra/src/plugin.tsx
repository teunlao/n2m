import { defineRenderPlugin } from '@n2m/core-renderer'

import { CacheProvider } from '@emotion/react'
import { ChakraProvider, type SystemContext } from '@chakra-ui/react'
import { createEmotionCache } from './emotion-cache.ts'
import { useCookies } from '@n2m/cookies'

export const PLUGIN_ID = 'chakra-plugin' as const

type ChakraPluginOptions = {
  system: SystemContext
  defaultColorMode: string
}

export const chakraPlugin = ({ system, defaultColorMode }: ChakraPluginOptions) => {
  return defineRenderPlugin({
    id: PLUGIN_ID,
    hooksForReq: () => {
      return {
        enabled: true,
        server: {
          emitToDocumentHtml: () => {
            return {
              class: useCookies().get('color-mode') ?? defaultColorMode ?? 'light',
            } as any
          },
        },
        common: {
          wrapApp: () => {
            const emotionCache = createEmotionCache()

            return ({ children }) => (
              <CacheProvider value={emotionCache}>
                <ChakraProvider value={system}>{children()}</ChakraProvider>
              </CacheProvider>
            )
          },
        },
      }
    },
  })
}
