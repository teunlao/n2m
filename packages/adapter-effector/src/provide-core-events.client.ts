import { createCoreEvents } from './core-events.factory.ts'
import { useScopedContainer } from '@n2m/core-di'
import { CoreEventsToken } from './tokens.ts'

export function provideCoreEventsClient() {
  const events = createCoreEvents()

  useScopedContainer().register(CoreEventsToken).toValue(events)
}
