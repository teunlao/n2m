import { defineProvider } from '@n2m/core-modules'
import { createStore } from 'effector'
import { routes } from '../../router.config.tsx'

export const layoutProvider = defineProvider(() => {
  const $navigation = createStore([
    { label: 'Home', route: routes.Home },
    { label: 'Articles', route: routes.Articles },
  ])

  return {
    '@@unitShape': () => ({
      navigation: $navigation,
    }),
  }
})

export type LayoutProvider = ReturnType<typeof layoutProvider>
