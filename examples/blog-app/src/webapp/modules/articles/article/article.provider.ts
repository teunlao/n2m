import { defineProvider, injectTransientResource } from '@n2m/core-modules'
import { ArticleQueryResourceToken } from '../tokens.ts'
import { createEffect, sample, scopeBind } from 'effector'
import { useCoreEvents, useCurrentScope } from '@n2m/adapter-effector'
import { defineCachedTransientApi } from '../../../helpers/define-cached-transient-api.ts'
import { routes } from '../../../router.config.tsx'

const createArticleApi = defineCachedTransientApi((id: string) => {
  // here we inject the transient dependency, so every time we call this factory, we get a new instance of ArticleQueryResource
  const articleQuery = injectTransientResource(ArticleQueryResourceToken)

  const data = useCurrentScope().getState(articleQuery.$data)

  if (!data) {
    scopeBind(articleQuery.start, { scope: useCurrentScope() })({ id })
  }

  return {
    articleQuery,
  }
})

export const articleProvider = defineProvider(() => {
  const { ssrStarted } = useCoreEvents()

  // fetch article once SSR started if the article page was requested
  sample({
    clock: ssrStarted,
    source: routes.Article.$params,
    filter: routes.Article.$isOpened,
    fn: (params) => ({ id: params.id }),
    target: createEffect<{ id: string }, unknown>(({ id }) => {
      createArticleApi(id).articleQuery.start({ id: id })
    }),
  })

  return {
    createArticleApi,
  }
})

export type ArticleProvider = ReturnType<typeof articleProvider>
