import { createCoreEvents } from './core-events.factory.ts'
import { useScopedContainer } from '@n2m/core-di'
import { CoreEventsToken } from './tokens.ts'
import { createMiddleware } from 'hono/factory'

export const provideCoreEvents = createMiddleware(async (c, next) => {
  const events = createCoreEvents()

  useScopedContainer().register(CoreEventsToken).toValue(events)

  await next()
})
