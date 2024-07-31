import { RootConfig } from '../server/create-root-config.ts'
import { ResultConfig } from '../types.ts'
import { createToken } from '@n2m/core-di/next'

export const RootConfigToken = createToken<RootConfig>('RootConfigToken')
export const RequestConfigToken = createToken<ResultConfig>('RequestConfigToken')
