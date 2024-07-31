import { describe, it, expect, vi } from 'vitest'
import { createContainer, createIdentifier } from '../index.ts'
import { performance, PerformanceObserver } from 'perf_hooks'

describe('Dependency Injection Container', () => {
  const NumberId = createIdentifier<number>('number')
  const StringId = createIdentifier<string>('string')
  const ObjectId = createIdentifier<{ value: number }>('object')
  const FunctionId = createIdentifier<() => string>('function')
  const AsyncDependencyId = createIdentifier<Promise<string>>('asyncDep')
  const ComplexObjectId = createIdentifier<{ nested: { value: number } }>('complexObject')

  it('simple', () => {
    let inc = 1

    const transientService = () => {
      return inc++
    }

    const container = createContainer()

    const serviceToken = createIdentifier<ReturnType<typeof service>>('serviceToken')
    const transientServiceToken = createIdentifier<ReturnType<typeof transientService>>('transientServiceToken')

    const service = function () {
      return {
        getMessage: () => 'Hello',
      }
    }

    const newService = () => {
      return Math.random()
    }

    container.register(serviceToken).toLazyFactory(service)
    container.register(transientServiceToken).toFactory(transientService, { lifecycle: 'transient' })

    const dep = container.resolve(serviceToken)

    container.replace(transientServiceToken).withFactory(newService, { lifecycle: 'transient' })

    const transientDep1 = container.resolve(transientServiceToken)
    const transientDep2 = container.resolve(transientServiceToken)

    container.resolve(transientServiceToken)

    expect(transientDep1).not.equal(transientDep2)
  })

  describe('Registration and Resolution', () => {
    it('should register and resolve a value', () => {
      const container = createContainer()
      container.register(NumberId).toValue(42)
      expect(container.resolve(NumberId)).toBe(42)
    })

    it('should register and resolve a factory', () => {
      const container = createContainer()
      container.register(StringId).toFactory(() => 'Hello')
      expect(container.resolve(StringId)).toBe('Hello')
    })

    it('should register and resolve a lazy factory', () => {
      const container = createContainer()
      const factory = vi.fn(() => 'Lazy Hello')
      container.register(StringId).toLazyFactory(factory)
      expect(factory).not.toHaveBeenCalled()
      expect(container.resolve(StringId)).toBe('Lazy Hello')
      expect(factory).toHaveBeenCalledTimes(1)
      expect(container.resolve(StringId)).toBe('Lazy Hello')
      expect(factory).toHaveBeenCalledTimes(1)
    })
  })

  describe('Lifecycle Management', () => {
    it('should create a new instance for transient factories', () => {
      const container = createContainer()
      let counter = 0
      container.register(NumberId).toFactory(() => ++counter, { lifecycle: 'transient' })
      expect(container.resolve(NumberId)).toBe(1)
      expect(container.resolve(NumberId)).toBe(2)
    })

    it('should reuse the same instance for singleton factories', () => {
      const container = createContainer()
      let counter = 0
      container.register(NumberId).toFactory(() => ++counter, { lifecycle: 'singleton' })
      expect(container.resolve(NumberId)).toBe(1)
      expect(container.resolve(NumberId)).toBe(1)
    })
  })

  describe('Dependency Replacement', () => {
    it('should replace a registered value', () => {
      const container = createContainer()
      container.register(NumberId).toValue(42)
      container.replace(NumberId).withValue(24)
      expect(container.resolve(NumberId)).toBe(24)
    })

    it('should replace a registered factory', () => {
      const container = createContainer()
      container.register(StringId).toFactory(() => 'Original')
      container.replace(StringId).withFactory(() => 'Replaced')
      expect(container.resolve(StringId)).toBe('Replaced')
    })

    it('should replace with a lazy factory', () => {
      const container = createContainer()
      container.register(StringId).toValue('Original')
      const factory = vi.fn(() => 'Lazy Replaced')
      container.replace(StringId).withLazyFactory(factory)
      expect(factory).not.toHaveBeenCalled()
      expect(container.resolve(StringId)).toBe('Lazy Replaced')
      expect(factory).toHaveBeenCalledTimes(1)
    })
  })

  describe('Auto-wiring', () => {
    it('should auto-wire dependencies', () => {
      const container = createContainer()
      container.register(NumberId).toValue(42)
      container.register(StringId).toValue('Hello')

      const result = container.autoWire((number: number, string: string) => {
        return `${string} ${number}`
      })

      expect(result).toBe('Hello 42')
    })

    it('should throw an error when auto-wiring fails', () => {
      const container = createContainer()
      expect(() => {
        container.autoWire((notRegistered: any) => notRegistered)
      }).toThrow('Cannot auto-wire parameter: notRegistered')
    })
  })

  describe('Scoped Containers', () => {
    it('should create a scoped container', () => {
      const rootContainer = createContainer()
      rootContainer.register(NumberId).toValue(42)

      const scopedContainer = rootContainer.createScope()
      scopedContainer.register(StringId).toValue('Scoped')

      expect(scopedContainer.resolve(NumberId)).toBe(42) // Resolves from parent
      expect(scopedContainer.resolve(StringId)).toBe('Scoped') // Resolves from scoped
      expect(() => rootContainer.resolve(StringId)).toThrow() // Not available in root
    })

    it('should override parent dependencies in scoped container', () => {
      const rootContainer = createContainer()
      rootContainer.register(NumberId).toValue(42)

      const scopedContainer = rootContainer.createScope()
      scopedContainer.register(NumberId).toValue(24)

      expect(rootContainer.resolve(NumberId)).toBe(42)
      expect(scopedContainer.resolve(NumberId)).toBe(24)
    })
  })

  describe('Error Handling', () => {
    it('should throw an error when resolving an unregistered dependency', () => {
      const container = createContainer()
      expect(() => container.resolve(NumberId)).toThrow('Dependency with identifier number not found')
    })
  })

  describe('Advanced Dependency Injection Scenarios', () => {
    const CircularDep1Id = createIdentifier<{ value: number; dep2?: any }>('circular1')
    const CircularDep2Id = createIdentifier<{ value: string; dep1: any }>('circular2')
    const AsyncDependencyId = createIdentifier<Promise<string>>('asyncDep')
    const ComplexObjectId = createIdentifier<{ nested: { value: number } }>('complexObject')

    it.skip('should handle circular dependencies', () => {
      const container = createContainer()

      container.register(CircularDep1Id).toFactory((c) => {
        const dep1 = { value: 1 }
        // @ts-expect-error
        dep1.dep2 = c.resolve(CircularDep2Id)
        return dep1
      })

      container.register(CircularDep2Id).toFactory((c) => ({
        value: 'circular',
        dep1: c.resolve(CircularDep1Id),
      }))

      const dep1 = container.resolve(CircularDep1Id)
      const dep2 = container.resolve(CircularDep2Id)

      expect(dep1.value).toBe(1)
      expect(dep1.dep2.value).toBe('circular')
      expect(dep2.dep1.value).toBe(1)
      expect(dep2.dep1).toBe(dep1) // Проверяем, что это тот же самый объект
    })

    it('should handle async dependencies', async () => {
      const container = createContainer()

      container.register(AsyncDependencyId).toFactory(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return 'async value'
      })

      const asyncDep = container.resolve(AsyncDependencyId)
      expect(asyncDep).toBeInstanceOf(Promise)
      expect(await asyncDep).toBe('async value')
    })

    it('should handle complex object structures', () => {
      const container = createContainer()

      container.register(ComplexObjectId).toFactory(() => ({
        nested: { value: 42 },
      }))

      const complexObj = container.resolve(ComplexObjectId)
      expect(complexObj.nested.value).toBe(42)
    })

    it('should handle dynamic dependency resolution', () => {
      const container = createContainer()
      const DynamicId = createIdentifier<number>('dynamic')

      //   @ts-expect-error
      container.register(DynamicId).toFactory((c) => {
        const currentDate = new Date()
        return currentDate.getHours() < 12 ? 'morning' : 'afternoon'
      })

      const result = container.resolve(DynamicId)
      expect(['morning', 'afternoon']).toContain(result)
    })

    it('should handle nested scopes', () => {
      const rootContainer = createContainer()
      rootContainer.register(NumberId).toValue(1)

      const middleScope = rootContainer.createScope()
      middleScope.register(StringId).toValue('middle')

      const innerScope = middleScope.createScope()
      innerScope.register(NumberId).toValue(2)

      expect(rootContainer.resolve(NumberId)).toBe(1)
      expect(middleScope.resolve(NumberId)).toBe(1)
      expect(middleScope.resolve(StringId)).toBe('middle')
      expect(innerScope.resolve(NumberId)).toBe(2)
      expect(innerScope.resolve(StringId)).toBe('middle')
      expect(() => rootContainer.resolve(StringId)).toThrow()
    })

    it.skip('should handle lazy circular dependencies', () => {
      const container = createContainer()

      container.register(CircularDep1Id).toLazyFactory((c) => {
        const dep1 = { value: 1 }
        Object.defineProperty(dep1, 'dep2', {
          get: () => c.resolve(CircularDep2Id),
        })
        return dep1
      })

      container.register(CircularDep2Id).toLazyFactory((c) => ({
        value: 'circular',
        get dep1() {
          return c.resolve(CircularDep1Id)
        },
      }))

      const dep1 = container.resolve(CircularDep1Id)
      const dep2 = container.resolve(CircularDep2Id)

      expect(dep1.value).toBe(1)
      expect(dep1.dep2.value).toBe('circular')
      expect(dep2.dep1.value).toBe(1)
    })

    it('should handle replacing dependencies in nested scopes', () => {
      const rootContainer = createContainer()

      rootContainer.register(NumberId).toValue(1)

      const scopedContainer = rootContainer.createScope()
      scopedContainer.replace(NumberId).withFactory((c) => {
        return c.resolve(NumberId) + 1
      })

      expect(rootContainer.resolve(NumberId)).toBe(1)
      expect(scopedContainer.resolve(NumberId)).toBe(2)
    })

    it.skip('should throw an error on cyclic dependencies without lazy loading', () => {
      const container = createContainer()

      container.register(CircularDep1Id).toFactory((c) => ({
        value: 1,
        dep2: c.resolve(CircularDep2Id),
      }))

      container.register(CircularDep2Id).toFactory((c) => ({
        value: 'circular',
        dep1: c.resolve(CircularDep1Id),
      }))

      expect(() => container.resolve(CircularDep1Id)).toThrow(/Cyclic dependency detected/)
    })
  })

  //   describe.skip('Circular Dependency Handling', () => {
  //     const CircularDep1Id = createIdentifier<{ value: number; dep2?: any }>('circular1')
  //     const CircularDep2Id = createIdentifier<{ value: string; dep1: any }>('circular2')
  //     const AsyncDependencyId = createIdentifier<Promise<string>>('asyncDep')
  //     const ComplexObjectId = createIdentifier<{ nested: { value: number } }>('complexObject')

  //     it('should handle circular dependencies when enabled globally', () => {
  //       const container = createContainer({ allowCircularDependencies: true })

  //       container.register(CircularDep1Id).toFactory((c) => ({
  //         value: 1,
  //         get dep2() {
  //           return c.resolve(CircularDep2Id)
  //         },
  //       }))

  //       container.register(CircularDep2Id).toFactory((c) => ({
  //         value: 'circular',
  //         get dep1() {
  //           return c.resolve(CircularDep1Id)
  //         },
  //       }))

  //       const dep1 = container.resolve(CircularDep1Id)
  //       const dep2 = container.resolve(CircularDep2Id)

  //       expect(dep1.value).toBe(1)
  //       expect(dep1.dep2.value).toBe('circular')
  //       expect(dep2.dep1.value).toBe(1)
  //       expect(dep2.dep1).toBe(dep1)
  //     })

  //     it('should handle circular dependencies when enabled for specific dependencies', () => {
  //       const container = createContainer()

  //       container.register(CircularDep1Id).toFactory(
  //         (c) => ({
  //           value: 1,
  //           get dep2() {
  //             return c.resolve(CircularDep2Id)
  //           },
  //         }),
  //         { cyclic: true }
  //       )

  //       container.register(CircularDep2Id).toFactory(
  //         (c) => ({
  //           value: 'circular',
  //           get dep1() {
  //             return c.resolve(CircularDep1Id)
  //           },
  //         }),
  //         { cyclic: true }
  //       )

  //       const dep1 = container.resolve(CircularDep1Id)
  //       const dep2 = container.resolve(CircularDep2Id)

  //       expect(dep1.value).toBe(1)
  //       expect(dep1.dep2.value).toBe('circular')
  //       expect(dep2.dep1.value).toBe(1)
  //       expect(dep2.dep1).toBe(dep1)
  //     })

  //     it('should throw an error for circular dependencies when not enabled', () => {
  //       const container = createContainer()

  //       container.register(CircularDep1Id).toFactory((c) => ({
  //         value: 1,
  //         get dep2() {
  //           return c.resolve(CircularDep2Id)
  //         },
  //       }))

  //       container.register(CircularDep2Id).toFactory((c) => ({
  //         value: 'circular',
  //         get dep1() {
  //           return c.resolve(CircularDep1Id)
  //         },
  //       }))

  //       expect(() => {
  //         const dep1 = container.resolve(CircularDep1Id)
  //         dep1.dep2.dep1
  //       }).toThrow(/Circular dependency detected/)
  //     })
  //   })

  it('should handle async dependencies', async () => {
    const container = createContainer()

    container.register(AsyncDependencyId).toFactory(async () => {
      return new Promise((resolve) => setTimeout(() => resolve('async value'), 100))
    })

    const asyncDep = container.resolve(AsyncDependencyId)
    expect(asyncDep).toBeInstanceOf(Promise)
    await expect(asyncDep).resolves.toBe('async value')
  })

  it('should handle complex object structures', () => {
    const container = createContainer()

    container.register(ComplexObjectId).toFactory(() => ({
      nested: { value: 42 },
    }))

    const complexObj = container.resolve(ComplexObjectId)
    expect(complexObj.nested.value).toBe(42)
  })

  it('should handle transient factories correctly', () => {
    const container = createContainer()
    const TransientId = createIdentifier<{ value: number }>('transient')

    let counter = 0
    container.register(TransientId).toFactory(() => ({ value: counter++ }), { lifecycle: 'transient' })

    const instance1 = container.resolve(TransientId)
    const instance2 = container.resolve(TransientId)

    expect(instance1.value).toBe(0)
    expect(instance2.value).toBe(1)
    expect(instance1).not.toBe(instance2)
  })

  it('should handle singleton factories correctly', () => {
    const container = createContainer()
    const SingletonId = createIdentifier<{ value: number }>('singleton')

    let counter = 0
    container.register(SingletonId).toFactory(() => ({ value: counter++ }), { lifecycle: 'singleton' })

    const instance1 = container.resolve(SingletonId)
    const instance2 = container.resolve(SingletonId)

    expect(instance1.value).toBe(0)
    expect(instance2.value).toBe(0)
    expect(instance1).toBe(instance2)
  })

  describe('Advanced Factory and Dependency Resolution', () => {
    const ValueId = createIdentifier<number>('value')
    const FactoryId = createIdentifier<() => number>('factory')
    const LazyId = createIdentifier<number>('lazy')
    const TransientId = createIdentifier<{ value: number }>('transient')
    const ComplexId = createIdentifier<{ nested: { value: number } }>('complex')

    it('should resolve nested dependencies in factories', () => {
      const container = createContainer()

      container.register(ValueId).toValue(42)
      container.register(FactoryId).toFactory((c) => () => c.resolve(ValueId) * 2)

      const factory = container.resolve(FactoryId)
      expect(factory()).toBe(84)
    })

    it('should handle lazy factories with dependencies', () => {
      const container = createContainer()
      let factoryCallCount = 0

      container.register(ValueId).toValue(10)
      container.register(LazyId).toLazyFactory((c) => {
        factoryCallCount++
        return c.resolve(ValueId) * 3
      })

      expect(factoryCallCount).toBe(0)
      expect(container.resolve(LazyId)).toBe(30)
      expect(factoryCallCount).toBe(1)
      expect(container.resolve(LazyId)).toBe(30)
      expect(factoryCallCount).toBe(1) // Фабрика не должна вызываться повторно
    })

    it.skip('should create new instances for transient dependencies in factories', () => {
      const container = createContainer()
      let counter = 0

      container.register(TransientId).toFactory(() => ({ value: counter++ }), { lifecycle: 'transient' })
      container.register(ComplexId).toLazyFactory((c) => ({
        nested: { value: c.resolve(TransientId).value },
      }))

      const instance1 = container.resolve(ComplexId)
      const instance2 = container.resolve(ComplexId)

      expect(instance1.nested.value).toBe(0)
      expect(instance2.nested.value).toBe(1)
    })

    it('should allow factories to access other dependencies', () => {
      const container = createContainer()

      container.register(ValueId).toValue(5)
      container.register(FactoryId).toFactory((c) => () => c.resolve(ValueId) * 2)
      container.register(ComplexId).toFactory((c) => ({
        nested: { value: c.resolve(FactoryId)() },
      }))

      const result = container.resolve(ComplexId)
      expect(result.nested.value).toBe(10)
    })

    it('should handle multiple levels of dependency in factories', () => {
      const container = createContainer()
      const Level1Id = createIdentifier<number>('level1')
      const Level2Id = createIdentifier<number>('level2')
      const Level3Id = createIdentifier<number>('level3')

      container.register(ValueId).toValue(2)
      container.register(Level1Id).toFactory((c) => c.resolve(ValueId) * 2)
      container.register(Level2Id).toFactory((c) => c.resolve(Level1Id) * 3)
      container.register(Level3Id).toFactory((c) => c.resolve(Level2Id) * 4)

      expect(container.resolve(Level3Id)).toBe(48) // 2 * 2 * 3 * 4
    })

    it('should handle replacing dependencies used in factories', () => {
      const container = createContainer()

      container.register(ValueId).toValue(5)
      container.register(FactoryId).toFactory((c) => () => c.resolve(ValueId) * 2)

      const initialResult = container.resolve(FactoryId)()
      expect(initialResult).toBe(10)

      container.replace(ValueId).withValue(7)

      const updatedResult = container.resolve(FactoryId)()
      expect(updatedResult).toBe(14)
    })
  })

  describe('Service with Inner Dependency Injection', () => {
    const InnerDependencyToken = createIdentifier<string>('innerDependency')
    const ServiceToken = createIdentifier<{ getMessage: () => string }>('service')

    it('should correctly inject inner dependencies in a service', () => {
      const container = createContainer()

      container.register(InnerDependencyToken).toValue('Hello from inner dependency')

      const inject = <T>(token: any) => container.resolve(token)

      container.register(ServiceToken).toFactory(() => {
        const innerDependency = inject(InnerDependencyToken)

        return {
          getMessage: () => `Service says: ${innerDependency}`,
        }
      })

      const service = container.resolve(ServiceToken)
      expect(service.getMessage()).toBe('Service says: Hello from inner dependency')
    })

    it('should allow replacing inner dependencies', () => {
      const container = createContainer()

      container.register(InnerDependencyToken).toValue('Original inner value')

      const inject = <T>(token: any) => container.resolve(token)

      container.register(ServiceToken).toFactory(() => {
        const innerDependency = inject(InnerDependencyToken)
        return {
          getMessage: () => `Service says: ${innerDependency}`,
        }
      })

      let service = container.resolve(ServiceToken)
      expect(service.getMessage()).toBe('Service says: Original inner value')

      container.replace(InnerDependencyToken).withValue('New inner value')

      service = container.resolve(ServiceToken)
      expect(service.getMessage()).toBe('Service says: New inner value')
    })
  })
})

describe('Container Performance Tests', () => {
  const measure = (name: string, fn: () => void): Promise<number> => {
    return new Promise((resolve) => {
      const obs = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0]
        obs.disconnect()
        resolve(entry.duration)
      })
      obs.observe({ entryTypes: ['measure'] })

      performance.mark('start')
      fn()
      performance.mark('end')
      performance.measure(name, 'start', 'end')
    })
  }

  const getMemoryUsage = () => {
    const used = process.memoryUsage()
    return Math.round((used.heapUsed / 1024 / 1024) * 100) / 100
  }

  it('should handle large number of registrations and resolutions efficiently', async () => {
    const container = createContainer()
    const numDependencies = 10000
    const identifiers = new Array(numDependencies).fill(0).map((_, i) => createIdentifier<number>(`dep${i}`))

    console.log('Initial memory usage:', getMemoryUsage(), 'MB')

    const registrationTime = await measure('Registration', () => {
      for (let i = 0; i < numDependencies; i++) {
        container.register(identifiers[i]).toValue(i)
      }
    })

    console.log('Memory usage after registration:', getMemoryUsage(), 'MB')
    console.log('Registration time:', registrationTime, 'ms')

    const resolutionTime = await measure('Resolution', () => {
      for (let i = 0; i < numDependencies; i++) {
        container.resolve(identifiers[i])
      }
    })

    console.log('Memory usage after resolution:', getMemoryUsage(), 'MB')
    console.log('Resolution time:', resolutionTime, 'ms')

    expect(registrationTime).toBeLessThan(1000) // Ожидаем регистрацию менее чем за 1 секунду
    expect(resolutionTime).toBeLessThan(1000) // Ожидаем разрешение менее чем за 1 секунду
  })

  it.skip('should handle deep dependency trees efficiently', async () => {
    const container = createContainer()
    const depth = 1000

    const createDeepDependency = (level: number): any => {
      const id = createIdentifier<any>(`level${level}`)
      if (level === 0) {
        container.register(id).toValue({ value: 'base' })
      } else {
        container.register(id).toFactory((c) => ({
          value: level,
          nested: c.resolve(createIdentifier<any>(`level${level - 1}`)),
        }))
      }
      return id
    }

    console.log('Initial memory usage:', getMemoryUsage(), 'MB')

    const setupTime = await measure('Deep Tree Setup', () => {
      for (let i = 0; i < depth; i++) {
        createDeepDependency(i)
      }
    })

    console.log('Memory usage after setup:', getMemoryUsage(), 'MB')
    console.log('Deep tree setup time:', setupTime, 'ms')

    const resolutionTime = await measure('Deep Tree Resolution', () => {
      container.resolve(createIdentifier<any>(`level${depth - 1}`))
    })

    console.log('Memory usage after resolution:', getMemoryUsage(), 'MB')
    console.log('Deep tree resolution time:', resolutionTime, 'ms')

    expect(setupTime).toBeLessThan(1000) // Ожидаем настройку менее чем за 1 секунду
    expect(resolutionTime).toBeLessThan(1000) // Ожидаем разрешение менее чем за 1 секунду
  })

  it('should handle complex scenarios with mixed lifecycles efficiently', async () => {
    const container = createContainer()
    const numDependencies = 1000
    const transientId = createIdentifier<{ value: number }>('transient')
    const singletonIds = new Array(numDependencies)
      .fill(0)
      .map((_, i) => createIdentifier<{ value: number; transient: { value: number } }>(`singleton${i}`))

    let counter = 0
    container.register(transientId).toFactory(() => ({ value: counter++ }), { lifecycle: 'transient' })

    console.log('Initial memory usage:', getMemoryUsage(), 'MB')

    const setupTime = await measure('Mixed Lifecycle Setup', () => {
      for (let i = 0; i < numDependencies; i++) {
        container.register(singletonIds[i]).toFactory((c) => ({
          value: i,
          transient: c.resolve(transientId),
        }))
      }
    })

    console.log('Memory usage after setup:', getMemoryUsage(), 'MB')
    console.log('Mixed lifecycle setup time:', setupTime, 'ms')

    const resolutionTime = await measure('Mixed Lifecycle Resolution', () => {
      for (let i = 0; i < numDependencies; i++) {
        container.resolve(singletonIds[i])
      }
    })

    console.log('Memory usage after resolution:', getMemoryUsage(), 'MB')
    console.log('Mixed lifecycle resolution time:', resolutionTime, 'ms')

    expect(setupTime).toBeLessThan(1000)
    expect(resolutionTime).toBeLessThan(1000)
  })
})
