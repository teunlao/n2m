import { createToken } from '@n2m/core-di'
import { type UnheadPluginDependency } from './plugin.tsx'

export const UnheadPluginToken = createToken<UnheadPluginDependency>('HeadPluginToken')
