import { defineRenderPlugin } from '@n2m/core-renderer'

import type { Device } from './generateFlags.ts'
import { generateFlags } from './generateFlags.ts'
export const PLUGIN_ID = 'device' as const
export const devicePlugin = () =>
  defineRenderPlugin({
    id: PLUGIN_ID,
    hooksForReq: ({ req }) => {
      let ua = ''

      if (import.meta.env.SSR) {
        ua = req.headers.get('user-agent') ?? ''
      } else {
        ua = navigator.userAgent
      }

      return {
        enabled: true,
        common: {
          extendCtx() {
            return {
              getDeviceFlags: (): Device => {
                try {
                  return generateFlags(req.headers, ua ?? '')
                } catch {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  return {}
                }
              },
            }
          },
        },
      }
    },
  })
