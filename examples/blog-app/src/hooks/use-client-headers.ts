import { injectDependency } from '@n2m/core-di'
import { RequestContextToken } from '@n2m/shared-tokens'

export const useClientHeaders = () => {
  const headers = injectDependency(RequestContextToken)?.req?.raw?.headers ?? new Map()
  return Object.fromEntries(headers.entries())
}
