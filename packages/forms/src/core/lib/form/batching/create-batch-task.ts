import { BatchInfo } from './types'

export function createBatchTask(fields: string[], type: 'errors' | 'values' | 'reset'): BatchInfo {
  return {
    id: Math.random().toString(),
    type,
    fields,
  }
}
