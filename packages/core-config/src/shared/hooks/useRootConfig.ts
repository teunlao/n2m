import { injectDependency } from '@n2m/core-di/next'
import { RootConfigToken } from '../../shared'
import { RootConfig } from '../../server/create-root-config.ts'

export function useRootConfig(): RootConfig {
  return injectDependency(RootConfigToken)
}
