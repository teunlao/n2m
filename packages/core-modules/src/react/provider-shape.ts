import { useUnit } from 'effector-react'
import { useRef } from 'react'
import { injectProvider, injectTransientProvider } from '../providers'
import type { Effect, EventCallable, Store } from 'effector'
import { Identifier } from '@n2m/core-di'

export function useProviderShape<Shape extends Record<string, EventCallable<any> | Effect<any, any, any> | Store<any>>>(
  providerIdentifier: Identifier<Shape | { '@@unitShape': () => Shape }>
) {
  const provider = injectProvider(providerIdentifier)

  return useUnit(provider as Shape | { '@@unitShape': () => Shape })
}

export function useTransientProviderShape<Shape extends (props: any) => any>(providerIdentifier: Identifier<Shape>) {
  const providerRef = useRef<ReturnType<Shape>>()

  if (!providerRef.current) {
    providerRef.current = injectTransientProvider(providerIdentifier)!
  }

  const unit = useUnit(providerRef.current!)

  return {
    ...unit,
    raw: providerRef.current!,
  }
}

export const useResourceShape = useProviderShape
export const useTransientResourceShape = useTransientProviderShape
