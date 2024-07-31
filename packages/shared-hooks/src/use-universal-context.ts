import { UniversalContextToken } from '@n2m/shared-tokens'
import { useScopedContainer } from '@n2m/core-di'
import type { BaseRequestContext } from '@n2m/core-renderer'

export const useUniversalContext = () => {
  const context = useScopedContainer().resolve(UniversalContextToken)

  return context as typeof context & BaseRequestContext
}
