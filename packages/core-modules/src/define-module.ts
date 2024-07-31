import { ProviderDefinition, SegmentDefinition } from './types.ts'
import { Identifier, injectDependency } from '@n2m/core-di/next'
import { RequestConfigToken, ResultConfig } from '@n2m/core-config/shared'
import React from 'react'
import { Inferable } from './hooks.ts'

export type PluggableHostComponent<T = any> = {
  Component: React.FC<T> | (() => T)
  order?: number
  enabled?: Inferable<boolean>
}

export type HostDefinition = {
  token: Identifier<Map<string, PluggableHostComponent>>
  components: Map<string, PluggableHostComponent>
}

export type ModuleConfigPart = {
  segments?: SegmentDefinition[]
  providers?: ProviderDefinition[]
  hosts?: HostDefinition[]
}

export type FactoryOptions = {
  config: ResultConfig
}

export type ModuleConfigPartFactory = (options: FactoryOptions) => ModuleConfigPart

export type DefineModuleOptions = {
  segments?: SegmentDefinition[]
  providers?: ProviderDefinition[]
  hosts?: HostDefinition[]
  parts?: ModuleConfigPartFactory[]
}

export type ModuleResult = DefineModuleOptions & {
  id: string
}

export type ModuleOverrides = DefineModuleOptions

type ModuleDefinition = ({ config }: FactoryOptions) => ModuleResult

export function setupModule(setupFactory: ({ config }: FactoryOptions) => ModuleOverrides) {
  return ({ config }: FactoryOptions) => {
    return setupFactory({ config })
  }
}

export function defineModule(definition: ModuleDefinition) {
  return (overridesFactory?: ReturnType<typeof setupModule>) => {
    return () => {
      const config = injectDependency(RequestConfigToken)

      const baseModuleResult = definition({ config })
      const overrides = overridesFactory?.({ config }) ?? {}

      const expandedBase = expandParts(baseModuleResult, config)
      const expandedOverrides = expandParts(overrides, config)

      const segments = mergeSegments(expandedBase.segments, expandedOverrides.segments)
      const providers = mergeProviders(expandedBase.providers, expandedOverrides.providers)
      const hosts = mergeHosts(expandedBase.hosts, expandedOverrides.hosts)

      return {
        id: baseModuleResult.id,
        providers,
        segments,
        hosts,
      }
    }
  }
}

function mergeSegments(
  baseSegments: SegmentDefinition[] = [],
  overrideSegments: SegmentDefinition[] = []
): SegmentDefinition[] {
  const mergedSegments = [...baseSegments]

  overrideSegments.forEach((segmentOverride) => {
    const segmentIndex = mergedSegments.findIndex((segment) => segment.token === segmentOverride.token)

    if (segmentIndex !== -1) {
      const existingSegment = mergedSegments[segmentIndex]

      if (existingSegment.component.__baseProps && segmentOverride.component.__baseProps) {
        segmentOverride.component.__mergedConfigAndBaseProps = {
          ...existingSegment.component.__baseProps,
          ...segmentOverride.component.__baseProps,
        }
        segmentOverride.component.__baseProps = existingSegment.component.__baseProps
      }

      mergedSegments[segmentIndex] = segmentOverride
    } else {
      mergedSegments.push(segmentOverride)
    }
  })

  return mergedSegments
}

function mergeProviders(
  baseProviders: ProviderDefinition[] = [],
  overrideProviders: ProviderDefinition[] = []
): ProviderDefinition[] {
  const mergedProviders = [...baseProviders]

  overrideProviders.forEach((providerOverride) => {
    const existingProviderIndex = mergedProviders.findIndex((provider) => provider.token === providerOverride.token)
    if (existingProviderIndex !== -1) {
      const existingProvider = mergedProviders[existingProviderIndex]

      if (existingProvider.useLazyFactory?.__baseProps && providerOverride.useLazyFactory?.__baseProps) {
        providerOverride.useLazyFactory.__baseProps = {
          ...existingProvider.useLazyFactory.__baseProps,
          ...providerOverride.useLazyFactory.__baseProps,
        }
      }

      mergedProviders[existingProviderIndex] = providerOverride
    } else {
      mergedProviders.push(providerOverride)
    }
  })

  return mergedProviders
}

function mergeHosts(baseHosts: HostDefinition[] = [], overrideHosts: HostDefinition[] = []): HostDefinition[] {
  const mergedHosts = [...baseHosts]

  overrideHosts.forEach((hostOverride) => {
    const existingHostIndex = mergedHosts.findIndex((host) => host.token === hostOverride.token)
    if (existingHostIndex !== -1) {
      const host = mergedHosts[existingHostIndex]

      host.components = new Map([...host.components, ...hostOverride.components])
    } else {
      mergedHosts.push(hostOverride)
    }
  })

  return mergedHosts
}

function expandParts(moduleData: DefineModuleOptions | ModuleResult, config: ResultConfig): DefineModuleOptions {
  if (!moduleData.parts || moduleData.parts.length === 0) {
    return moduleData
  }

  const expandedParts = moduleData.parts.map((partFactory) => partFactory({ config }))

  return {
    segments: [...(moduleData.segments || []), ...expandedParts.flatMap((part) => part.segments || [])],
    providers: [...(moduleData.providers || []), ...expandedParts.flatMap((part) => part.providers || [])],
    hosts: [...(moduleData.hosts || []), ...expandedParts.flatMap((part) => part.hosts || [])],
  }
}

export type DefineModule = ReturnType<typeof defineModule>

export function defineModuleConfigPart(configFactory: ModuleConfigPartFactory): ModuleConfigPartFactory {
  return configFactory
}
