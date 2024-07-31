import { registry } from '@n2m/core-di/next'
import { createRootConfig } from './create-root-config.ts'
import { RootConfigToken } from '../shared'

export function bindRootConfig() {
  const rootConfig = createRootConfig()

  registry.get('root').register(RootConfigToken).toValue(rootConfig)

  return rootConfig
}
