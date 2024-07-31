import type { ResultConfig } from '@n2m/core-config'
import * as R from 'remeda'

export type Task = {
  id: string
  execute: () => void
  environment?: 'client' | 'server'
  condition?: (config: ResultConfig) => boolean
}

export const createTask = (task: Task): Task => task

export const isTaskExecutable =
  (config: ResultConfig) =>
  (task: Task): boolean => {
    const isCorrectEnvironment =
      R.isNullish(task.environment) ||
      (task.environment === 'client' && config.isClient) ||
      (task.environment === 'server' && config.isServer)

    const isMeetsCondition = R.isNullish(task.condition) || task.condition(config)
    return isCorrectEnvironment && isMeetsCondition
  }

export const executeTasks = (tasks: Task[], config: ResultConfig) => {
  R.pipe(
    tasks,
    R.filter(isTaskExecutable(config)),
    R.forEach((task) => task.execute())
  )
}

export const mergeTasks = (tasks: Task[], defaultTasks: Task[]): Task[] =>
  R.pipe(
    tasks,
    R.reduce((acc, task) => {
      const index = R.findIndex(acc, (old) => old.id === task.id)
      return index !== -1 ? R.set(acc, index, task) : [...acc, task]
    }, defaultTasks)
  )
