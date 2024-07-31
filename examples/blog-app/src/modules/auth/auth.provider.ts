import { defineProvider } from '@n2m/core-modules'
import { createEvent, sample } from 'effector'
import { injectDependency } from '@n2m/core-di'
import { LogoutMutationResourceToken, MeQueryResourceToken } from './tokens.ts'
import { useCoreEvents } from '@n2m/adapter-effector'

export const authProvider = defineProvider(() => {
  const { ssrStarted } = useCoreEvents()
  const meQuery = injectDependency(MeQueryResourceToken)
  const logoutMutation = injectDependency(LogoutMutationResourceToken)

  const logoutClicked = createEvent()

  const $isAuthenticated = meQuery.$data.map((data) => !!data?.user, { skipVoid: false })
  const $email = meQuery.$data.map((data) => data?.user?.email, { skipVoid: false })

  sample({
    clock: ssrStarted,
    target: meQuery.start,
  })

  sample({
    clock: logoutClicked,
    target: logoutMutation.start,
  })

  sample({
    clock: logoutMutation.finished.success,
    target: meQuery.start,
  })

  return {
    '@@unitShape': () => ({
      logoutClicked,
      email: $email,
      isAuthenticated: $isAuthenticated,
    }),
  }
})

export type AuthProvider = ReturnType<typeof authProvider>
