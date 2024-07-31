import { createToken } from '@n2m/core-di'
import { UniversalContext } from '@n2m/shared-types'

export const UniversalContextToken = createToken<UniversalContext>('UniversalContext')
