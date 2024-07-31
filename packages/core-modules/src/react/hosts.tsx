import { Identifier, injectDependency } from '@n2m/core-di'
import { PluggableHostComponent } from '../define-module.ts'
import React, { useMemo } from 'react'
import { infer } from '../hooks.ts'

type HostToken = Identifier<Map<string, PluggableHostComponent>>

export function useHostSlotContainer(token: HostToken) {
  const host = injectDependency(token)

  const addEntry = <T,>(name: string, Component: PluggableHostComponent<T>) => {
    host.set(name, Component)
  }

  const remove = (name: string) => {
    host.delete(name)
  }

  const updateOrder = (name: string, newOrder: number) => {
    const component = host.get(name)
    if (component) {
      host.set(name, { ...component, order: newOrder })
    }
  }

  return { addEntry, remove, updateOrder, __instance: host }
}

type HostSlotProps<T> = {
  token: HostToken
} & Partial<T>

type HostSlotFactory = <T>(props: HostSlotProps<T>) => React.ReactElement | null

const HostSlotInner = <T,>({ token, ...props }: HostSlotProps<T>): React.ReactElement => {
  const hostMap = injectDependency(token, { throwIfNotFound: false }) ?? new Map()

  const sortedComponents = useMemo(() => {
    return Array.from(hostMap.entries()).sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
  }, [hostMap])

  return (
    <>
      {sortedComponents.map(([name, entry]) => {
        const ComponentWrapper = () => {
          const c = entry.Component

          // @ts-ignore
          const Component: React.FC = c.__injector ? c() : c

          const isEnabled = entry.enabled ? infer(entry.enabled) : true
          return isEnabled ? <Component {...props} /> : null
        }
        return <ComponentWrapper key={name} />
      })}
    </>
  )
}

export const HostContainer: HostSlotFactory = HostSlotInner as HostSlotFactory
export const HostContainerCached = React.memo(HostSlotInner) as HostSlotFactory

export function segmentToHost<T>(token: Identifier<T>) {
  const injector = () => injectDependency(token, { throwIfNotFound: false }) as T
  injector.__injector = true

  return injector
}
