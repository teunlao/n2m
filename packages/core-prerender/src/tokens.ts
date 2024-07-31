import { createToken } from '@n2m/core-di'
import { type ShellInjectorHooks } from '@n2m/shared-types'

export const PrerenderInjectorHooksToken = createToken<ShellInjectorHooks>('PrerenderHooksToken')
