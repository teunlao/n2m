// @ts-nocheck
import { createEffect, Effect, Scope, scopeBind } from 'effector'

export const bindEffectToScope = <T, S>(effect: Effect<T, S>, scope: Scope) => {
  return createEffect((params) =>
    scopeBind(effect, {
      scope,
    })(params)
  ) as Effect<T, S>
}
