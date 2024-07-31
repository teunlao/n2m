import { createEvent } from 'effector'

type CoreEvents = ReturnType<typeof createCoreEvents>

function createCoreEvents() {
  const ssrStarted = createEvent<void>({ sid: 'ssr_started' })
  const appStarted = createEvent<void>({ sid: 'app_started' })

  return {
    ssrStarted,
    appStarted,
  }
}

export { createCoreEvents, type CoreEvents }
