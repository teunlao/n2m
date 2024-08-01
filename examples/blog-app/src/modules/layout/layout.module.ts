import { defineModule, registerProvider } from '@n2m/core-modules'
import { LayoutSegment } from './layout.segment.tsx'
import { LayoutProviderToken, LayoutSegmentToken } from './tokens.ts'
import { layoutProvider } from './layout.provider.ts'

export const MODULE_ID = 'articles' as const

export const LayoutModule = defineModule(() => ({
  id: MODULE_ID,
  segments: [
    {
      token: LayoutSegmentToken,
      component: LayoutSegment,
    },
  ],
  providers: [
    {
      token: LayoutProviderToken,
      useLazyFactory: registerProvider(layoutProvider),
    },
  ],
}))
