import { injectDependency } from '@n2m/core-di/next'
import { RequestConfigToken } from '../tokens.ts'
import { type ResultConfig } from '../../types.ts'

export function useConfig(): ResultConfig {
  return injectDependency(RequestConfigToken) as ResultConfig
}
