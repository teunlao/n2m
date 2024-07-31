import { createTask } from '../utils.ts'
import { createEffect, sample } from 'effector'
import type { Head } from '@n2m/shared-types'
import { routes } from '../../../router.config.tsx'
import { useUnhead } from '@n2m/plugin-unhead'
import { injectProvider } from '@n2m/core-modules'
import { ArticleProviderToken } from '../../articles/tokens.ts'

const updateMetaFx = createEffect((head: Head) => useUnhead().useHead(head))

export const UPDATE_META_TASK_ID = 'update-meta-task' as const

export const updateArticleMeta = createTask({
  id: UPDATE_META_TASK_ID,
  execute: () => {
    sample({
      clock: routes.Article.opened,
      source: routes.Article.$params,
      fn: (params) => params.id,
      target: createEffect((id: string) => {
        const { useArticleApi } = injectProvider(ArticleProviderToken)
        const { articleQuery } = useArticleApi(id)

        articleQuery.$data.watch((data) => {
          data &&
            void updateMetaFx({
              title: data.title,
              meta: [
                {
                  name: 'description',
                  content: data.meta?.description,
                },
              ],
            })
        })
      }),
    })
  },
})
