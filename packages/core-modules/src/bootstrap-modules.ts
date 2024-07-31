import type { ProviderDefinition, SegmentDefinition } from './types.ts'
import { type Container, useScopedContainer } from '@n2m/core-di'
import { type HostDefinition } from './define-module.ts'

type InjectedUnits = {
  providers: ProviderDefinition[]
  segments: SegmentDefinition[]
  hosts: HostDefinition[]
}

const providerHandlers = {
  useFactory: (provider: ProviderDefinition, container: Container) => {
    container.register(provider.token).toFactory(provider.useFactory?.(), { lifecycle: 'singleton' })
  },
  useLazyFactory: (provider: ProviderDefinition, container: Container) => {
    container.register(provider.token).toLazyFactory(provider.useLazyFactory!)

    // TODO implement livecycle hooks like onActivation on new DI container
    // .onActivation((context, instance) => {
    //   if (instance?.reactions) {
    //     Object.entries(instance.reactions).forEach(([_, reaction]) => {
    //       ;(reaction as Function)?.()
    //     })
    //   }
    //
    //   return instance
    // })

    provider.eager && container.resolve(provider.token)
  },
  // useDynamicFactory: (provider: ProviderDefinition, container: Container) => {
  //   container?.register(provider.token).toDynamicValue(provider.useDynamicFactory as FactoryCreator<any>)
  // },
  useTransientFactory: (provider: ProviderDefinition, container: Container) => {
    container.register(provider.token).toFactory(provider?.useTransientFactory, { lifecycle: 'transient' })
  },
}

export const bootstrapModules = (moduleDefinitions: Function[], req: Request) => {
  const container = useScopedContainer()

  const injectedUnits = moduleDefinitions.reduce(
    (acc, moduleDefinition) => {
      const definition = moduleDefinition(req)

      acc.providers.push(...(definition.providers ?? []))
      acc.hosts.push(...(definition.hosts ?? []))
      acc.segments.push(...(definition.segments ?? []))

      return acc
    },
    { providers: [], segments: [], hosts: [] } as InjectedUnits
  )

  injectedUnits.providers.forEach((provider) => {
    const providedKey = Object.keys(provider)?.find((key) => key.startsWith('use')) as string

    if (providedKey && providerHandlers[providedKey]) {
      const handler = providerHandlers[providedKey]
      handler(provider, container)
    }
  })

  injectedUnits.segments.forEach((segment) => {
    container?.register(segment.token).toValue(segment.component)
  })

  injectedUnits.hosts.forEach((host) => {
    container.register(host.token).toValue(host?.components)
  })
}
