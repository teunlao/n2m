import * as R from 'remeda'
import { createTask } from '../utils.ts'
import { createEffect, sample } from 'effector'
import type { Head } from '@n2m/shared-types'
import { routes } from '../../../router.config.tsx'
import { useUnhead } from '@n2m/plugin-unhead'

const updateMetaFx = createEffect((head: Head) => useUnhead().useHead(head))

export const UPDATE_META_TASK_ID = 'update-meta-task' as const

export const updatePageMetaTask = createTask({
  id: UPDATE_META_TASK_ID,
  execute: () => {
    R.pipe(
      R.values(routes),
      R.filter((route) => R.isTruthy(route.meta)),
      R.forEach((route) => {
        sample({
          // @ts-expect-error
          clock: route.opened,
          fn: () => route.meta!['en'],
          target: updateMetaFx,
        })
      })
    )
  },
})
