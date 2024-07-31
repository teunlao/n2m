import { useDependency } from '@n2m/shared-hooks'
import { UnheadPluginToken } from './token.ts'

export function useUnhead() {
  return useDependency(UnheadPluginToken)
}
