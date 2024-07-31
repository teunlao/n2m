import { createToken } from '@n2m/core-di'
import { type SigninMutationResource } from './signin/signin.mutation.ts'
import { type AuthProvider } from './auth.provider.ts'
import { type MeQueryResource } from './me.query.resource.ts'
import { type SigninDialogProvider } from './signin/signin-dialog.provider.ts'
import { type LogoutMutationResource } from './logout/logout.mutation.resource.ts'

export const SigninMutationResourceToken = createToken<SigninMutationResource>('SigninMutationResourceToken')
export const AuthProviderToken = createToken<AuthProvider>('AuthProviderToken')
export const MeQueryResourceToken = createToken<MeQueryResource>('MeQueryToken')
export const SigninDialogProviderToken = createToken<SigninDialogProvider>('SigninDialogProviderToken')
export const LogoutMutationResourceToken = createToken<LogoutMutationResource>('LogoutMutationResourceToken')
