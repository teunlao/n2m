import { createToken } from '@n2m/core-di'
import { TaskManagerProvider } from './task-manager.provider'

export const TaskManagerProviderToken = createToken<TaskManagerProvider>('TaskManagerProviderToken')
