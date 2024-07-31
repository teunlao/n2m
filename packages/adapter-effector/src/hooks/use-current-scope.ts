import { injectDependency } from '@n2m/core-di'
import { CurrentEffectorScopeToken } from '../tokens.ts'

export const useCurrentScope = () => injectDependency(CurrentEffectorScopeToken)
