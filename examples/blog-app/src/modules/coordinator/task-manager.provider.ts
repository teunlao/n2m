import { useConfig } from '@n2m/core-config/shared'
import { defineProvider } from '@n2m/core-modules'
import { executeTasks, type Task } from './utils.ts'
import { updatePageMetaTask } from './tasks/update-page-meta.task.ts'
import { updateArticleMeta } from './tasks/update-article-meta.task.ts'

export const taskManagerProvider = defineProvider(() => {
  const defaultTasks = [
    // ignore-prettier
    updatePageMetaTask,
    updateArticleMeta,
  ] satisfies Task[]

  executeTasks(defaultTasks, useConfig())
})

export type TaskManagerProvider = ReturnType<typeof taskManagerProvider>
