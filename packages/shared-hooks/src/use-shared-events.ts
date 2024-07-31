import { useUniversalContext } from './use-universal-context.ts'

export const useSharedEvents = (): SharedEvents => {
  return useUniversalContext().sharedEvents as SharedEvents
}
