import { TaskManagerProviderToken } from './tokens'
import { taskManagerProvider } from './task-manager.provider'
import { defineModule, registerProvider } from '@n2m/core-modules'

export const CoordinatorModule = defineModule(() => ({
  id: 'TaskManager' as const,
  providers: [
    {
      token: TaskManagerProviderToken,
      useFactory: registerProvider(taskManagerProvider),
    },
  ],
}))
