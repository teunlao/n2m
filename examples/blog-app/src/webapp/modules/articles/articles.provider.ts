import { defineProvider, injectResource } from '@n2m/core-modules'
import { ArticlesQueryResourceToken } from './tokens.ts'
import { useCoreEvents } from '@n2m/adapter-effector'
import { createGate } from 'effector-react'
import { sample } from 'effector'
import { routes } from '../../router.config.tsx'
import { cache } from '@farfetched/core'

export const articlesProvider = defineProvider(() => {
  const { ssrStarted } = useCoreEvents()
  const gate = createGate()

  const articlesQuery = injectResource(ArticlesQueryResourceToken)

  // ensure that articles will be loaded on server only if Articles page is already opened
  sample({
    clock: ssrStarted,
    filter: routes.Articles.$isOpened,
    target: articlesQuery.start,
  })

  cache(articlesQuery, { staleAfter: '5m' })

  sample({
    clock: routes.Articles.navigate,
    target: articlesQuery.start,
  })

  return {
    articlesQuery,
    gate,
    '@@unitShape': () => ({
      gate,
    }),
  }
})

export type ArticlesProvider = ReturnType<typeof articlesProvider>
