import { defineModule, registerProvider } from '@n2m/core-modules'
import { MainLayout } from './MainLayout.tsx'
import { LayoutProviderToken, LayoutSegmentToken } from './tokens.ts'
import { layoutProvider } from './layout.provider.ts'

export const MODULE_ID = 'articles' as const

export const LayoutModule = defineModule(() => ({
  id: MODULE_ID,
  segments: [
    {
      token: LayoutSegmentToken,
      component: MainLayout,
    },
  ],
  providers: [
    {
      token: LayoutProviderToken,
      useLazyFactory: registerProvider(layoutProvider),
    },
  ],
}))
