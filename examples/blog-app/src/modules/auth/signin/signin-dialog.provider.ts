import { defineProvider } from '@n2m/core-modules'
import { createForm } from '@n2m/forms'
import { zodAdapter } from '@n2m/forms/zod-adapter'
import { z } from 'zod'
import { createEvent, createStore, sample } from 'effector'
import { injectDependency } from '@n2m/core-di'
import { MeQueryResourceToken, SigninMutationResourceToken } from '../tokens.ts'
import { JsonApiRequestError } from '@farfetched/core'
import { createEffect } from 'effector/compat'

const reloadFx = createEffect(() => window.location.reload())

export const signinDialogProvider = defineProvider(() => {
  const signinMutation = injectDependency(SigninMutationResourceToken)
  const meQuery = injectDependency(MeQueryResourceToken)

  const toggleDialog = createEvent<boolean>()
  const $isDialogOpen = createStore(false)
  $isDialogOpen.on(toggleDialog, (_, value) => value)

  const form = createForm({
    schema: {
      email: 'demo@payloadcms.com',
      password: 'demo',
    },
    validationStrategies: ['submit'],
    clearOuterErrorsOnSubmit: true,
    validation: zodAdapter(() =>
      z.object({
        email: z.string().min(1, { message: 'Email required' }),
        password: z.string().min(1, { message: 'Password required' }),
      })
    ),
  })

  const $signinError = createStore<JsonApiRequestError | null>(null)
  // $signinError.on(signinMutation.finished.failure, (_, error) => error.error)

  sample({
    clock: form.validatedAndSubmitted,
    target: signinMutation.start,
  })

  sample({
    clock: signinMutation.finished.failure,
    filter: (val) => val.error.errorType === 'PREPARATION',
    target: [toggleDialog.prepend(() => false), meQuery.start],
  })

  sample({
    clock: signinMutation.finished.success,
    target: [toggleDialog.prepend(() => false), meQuery.start, reloadFx],
  })

  return {
    form,
    $signinError,
    '@@unitShape': () => ({
      isDialogOpen: $isDialogOpen,
      toggleDialog,
      $signinError,
    }),
  }
})

export type SigninDialogProvider = ReturnType<typeof signinDialogProvider>
