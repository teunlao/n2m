import { type ShellInjectorHooks } from '@n2m/shared-types'
import { createToken } from '@n2m/core-di'
import { type Context } from 'hono'

export const ShellInjectorHooksToken = createToken<ShellInjectorHooks[]>('ShellInjectorHooksToken')
export const RequestContextToken = createToken<Context>('RequestContextToken')
