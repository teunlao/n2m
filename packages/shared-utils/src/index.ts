export * from './effector'
export * from './app'
export { generateDeviceFlags } from './generate-device-flags.ts'
export { getLanguageFromString } from './getLanguageFromString.ts'
export { useLocalStorage, useSessionStorage } from './storage.ts'
export * from './runtime-adapter.ts'
import * as R from 'remeda'
export { R }

export const compact = <T>(arr: (T | null | undefined | false)[]): T[] => R.filter(arr, (item): item is T => !!item)
