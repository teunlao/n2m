import { Container, Identifier, Factory } from './types'
import { getParameterNames } from './utils'

export function createContainer(parentContainer?: Container): Container {
  const dependencies = new Map<Identifier<any>, any>()
  const factories = new Map<Identifier<any>, { factory: Factory<any>; lifecycle: 'singleton' | 'transient' }>()
  const lazyFactories = new Map<Identifier<any>, Factory<any>>()
  const resolutionStack = new Set<Identifier<any>>()

  const debug = (): string => {
    let output = 'Container Debug Information:\n'

    for (const [identifier, value] of dependencies) {
      output += `  ${String(identifier?.value)}: [Value]\n`
    }

    for (const [identifier, { lifecycle }] of factories) {
      if (!dependencies.has(identifier)) {
        output += `  ${String(identifier?.value)}: [Factory] (${lifecycle})\n`
      }
    }

    for (const [identifier] of lazyFactories) {
      if (!dependencies.has(identifier) && !factories.has(identifier)) {
        output += `  ${String(identifier?.value)}: [Lazy Factory]\n`
      }
    }

    if (parentContainer) {
      output += 'Parent Container:\n'
      output += parentContainer
        .debug()
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n')
    }

    return output
  }

  const clearDependentFactories = (identifier: Identifier<any>) => {
    dependencies.delete(identifier)

    for (const [id, entry] of factories.entries()) {
      if (entry.lifecycle === 'singleton') {
        dependencies.delete(id)
      }
    }
  }

  const register = <T>(identifier: Identifier<T>) => {
    return {
      toValue: (value: T) => {
        dependencies.set(identifier, value)
      },
      toFactory: (
        factory: Factory<T>,
        options: { lifecycle: 'singleton' | 'transient' } = { lifecycle: 'singleton' }
      ) => {
        factories.set(identifier, { factory, lifecycle: options.lifecycle })
      },
      toLazyFactory: (factory: Factory<T>) => {
        lazyFactories.set(identifier, factory)
      },
    }
  }

  const resolveFactory = <T>(identifier: Identifier<T>, forceTransient: boolean = false): T => {
    const entry = factories.get(identifier)
    if (!entry) throw new Error(`Factory not found for ${String(identifier.value)}`)

    const instance = entry.factory(container)

    if (!forceTransient && entry.lifecycle === 'singleton') {
      dependencies.set(identifier, instance)
    }

    return instance
  }

  const resolve = <T>(identifier: Identifier<T>, forceTransient: boolean = false): T => {
    if (resolutionStack.has(identifier)) {
      if (lazyFactories.has(identifier)) {
        const factory = lazyFactories.get(identifier) as Factory<T>
        const instance = factory(container)
        dependencies.set(identifier, instance)
        lazyFactories.delete(identifier)
        return instance
      }

      if (parentContainer) {
        return parentContainer.resolve(identifier)
      }

      throw new Error(`Cyclic dependency detected for ${String(identifier.value)}`)
    }

    resolutionStack.add(identifier)

    try {
      if (!forceTransient && dependencies.has(identifier)) {
        return dependencies.get(identifier) as T
      }
      if (factories.has(identifier)) {
        const entry = factories.get(identifier)!
        return resolveFactory(identifier, forceTransient || entry.lifecycle === 'transient')
      }
      if (lazyFactories.has(identifier)) {
        const factory = lazyFactories.get(identifier) as Factory<T>
        const instance = factory(container)
        if (!forceTransient) {
          dependencies.set(identifier, instance)
          lazyFactories.delete(identifier)
        }
        return instance
      }
      if (parentContainer) {
        return parentContainer.resolve(identifier)
      }
      throw new Error(`Dependency with identifier ${String(identifier.value)} not found`)
    } finally {
      resolutionStack.delete(identifier)
    }
  }

  const replace = <T>(identifier: Identifier<T>) => {
    return {
      withValue: (value: T) => {
        clearDependentFactories(identifier)
        dependencies.set(identifier, value)
        factories.delete(identifier)
        lazyFactories.delete(identifier)
      },
      withFactory: (
        factory: Factory<T>,
        options: { lifecycle: 'singleton' | 'transient' } = { lifecycle: 'singleton' }
      ) => {
        clearDependentFactories(identifier)
        factories.set(identifier, { factory, lifecycle: options.lifecycle })
        lazyFactories.delete(identifier)
      },
      withLazyFactory: (factory: Factory<T>) => {
        clearDependentFactories(identifier)
        lazyFactories.set(identifier, factory)
        factories.delete(identifier)
      },
    }
  }

  const autoWire = <T, Args extends any[]>(factory: (...args: Args) => T): T => {
    const paramNames = getParameterNames(factory)
    const resolvedDependencies = paramNames.map((name) => {
      for (const [identifier] of [...dependencies.entries(), ...factories.entries(), ...lazyFactories.entries()]) {
        if (identifier.value === name) {
          return resolve(identifier)
        }
      }
      throw new Error(`Cannot auto-wire parameter: ${name}`)
    }) as Args

    return factory(...resolvedDependencies)
  }

  const __getInternalDeps = () => {
    return {
      dependencies,
      factories,
      lazyFactories,
    }
  }

  const container: Container = {
    __getInternalDeps,
    register,
    resolve: (identifier) => resolve(identifier),
    replace,
    autoWire,
    createScope: () => createContainer(container),
    debug,
  }

  return container
}
