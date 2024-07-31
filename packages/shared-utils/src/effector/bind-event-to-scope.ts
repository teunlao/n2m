import { EventCallable, Scope, scopeBind } from 'effector'

export const bindEventToScope = <T = void, S = () => void>(event: EventCallable<T>, scope: Scope) => {
  return scopeBind(event, {
    scope,
  }) as T extends void ? S : EventCallable<T>
}
