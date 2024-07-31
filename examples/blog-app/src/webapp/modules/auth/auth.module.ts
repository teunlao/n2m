import { defineModule, registerProvider, registerResource } from '@n2m/core-modules'
import {
  AuthProviderToken,
  SigninMutationResourceToken,
  MeQueryResourceToken,
  SigninDialogProviderToken,
  LogoutMutationResourceToken,
} from './tokens.ts'
import { signinMutationResource } from './signin/signin.mutation.ts'
import { authProvider } from './auth.provider.ts'
import { meQueryResource } from './me.query.resource.ts'
import { signinDialogProvider } from './signin/signin-dialog.provider.ts'
import { logoutMutationResource } from './logout/logout.mutation.resource.ts'

export const MODULE_ID = 'auth' as const

export const authModule = defineModule(() => ({
  id: MODULE_ID,
  providers: [
    {
      token: SigninDialogProviderToken,
      useLazyFactory: registerProvider(signinDialogProvider),
    },
    {
      token: MeQueryResourceToken,
      useLazyFactory: registerResource(meQueryResource),
    },
    {
      token: SigninMutationResourceToken,
      useLazyFactory: registerResource(signinMutationResource),
    },
    {
      token: LogoutMutationResourceToken,
      useLazyFactory: registerResource(logoutMutationResource),
    },
    {
      token: AuthProviderToken,
      useLazyFactory: registerProvider(authProvider),
      eager: true,
    },
  ],
}))
