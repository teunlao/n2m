import { createEffect, Effect, EventCallable, scopeBind } from 'effector'
import { useCurrentScope } from '../hooks'

export const scopedEvent = <T>(event: EventCallable<T>) => {
  // await new Promise((resolve) => setTimeout(resolve, 0))
  return createEffect((args: T) => {
    return scopeBind(event, { scope: useCurrentScope() })(args as T)
  })
}

export const scopedFx = <T, R>(fx: Effect<T, R>) => {
  return (args: T) => {
    return scopeBind(fx, { scope: useCurrentScope() })(args as T)
  }
}
