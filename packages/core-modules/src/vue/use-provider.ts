import type { Effect, EventCallable, Store } from 'effector'
import { useUnit } from 'effector-vue/composition'
import { injectProvider, injectTransientProvider } from '../providers/providers.ts'
import { Identifier } from '@n2m/core-di'

export function useProviderShape<Shape extends Record<string, EventCallable<any> | Effect<any, any, any> | Store<any>>>(
  providerIdentifier: Identifier<Shape | { '@@unitShape': () => Shape }>
) {
  const provider = injectProvider(providerIdentifier)

  return useUnit(provider as Shape | { '@@unitShape': () => Shape })
}

export function useTransientProviderShape<Shape extends (props: any) => any>(providerIdentifier: Identifier<Shape>) {
  const provider = injectTransientProvider(providerIdentifier)

  return {
    ...useUnit(provider),
    raw: provider,
  }
}

export const useModelShape = useProviderShape
export const useTransientModelShape = useTransientProviderShape
export const useResourceShape = useProviderShape
export const useTransientResourceShape = useTransientProviderShape
