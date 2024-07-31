import { injectDependency } from '@n2m/core-di'
import { CoreEventsToken } from '../tokens.ts'

export const useCoreEvents = () => injectDependency(CoreEventsToken)
