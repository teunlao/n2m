// serverHooks.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { injectDependency } from '../server/hooks.ts'
import { createContainer, createIdentifier, createAsyncScope, useScopedContainer } from '../server/index'
import { containerRegistry } from '../registry'

describe('injectDependency (server)', () => {
  const TestTokenId = createIdentifier<string>('testToken')

  beforeEach(() => {
    containerRegistry.reset()
  })

  it('should inject dependency from async context', async () => {
    const rootContainer = createContainer()
    const createRequestScope = createAsyncScope(rootContainer)

    await createRequestScope(async () => {
      const container = useScopedContainer()
      container.register(TestTokenId).toValue('async context value')

      const result = injectDependency(TestTokenId)
      expect(result).toBe('async context value')
    })
  })

  it('should fallback to registry when async context is not available', () => {
    const container = containerRegistry.create('testContainer')
    container.register(TestTokenId).toValue('registry value')

    const result = injectDependency(TestTokenId)
    expect(result).toBe('registry value')
  })

  it('should return undefined when dependency not found and throwIfNotFound is false', () => {
    const result = injectDependency(TestTokenId)
    expect(result).toBeUndefined()
  })

  it('should throw error when dependency not found and throwIfNotFound is true', () => {
    expect(() => injectDependency(TestTokenId, { throwIfNotFound: true })).toThrow(
      'Dependency with token testToken not found in any container'
    )
  })

  it('should search through multiple containers in registry', () => {
    const container1 = containerRegistry.create('container1')
    const container2 = containerRegistry.create('container2')

    container2.register(TestTokenId).toValue('container2 value')

    const result = injectDependency(TestTokenId)
    expect(result).toBe('container2 value')
  })

  it('should prioritize async context over registry', async () => {
    const rootContainer = createContainer()
    const createRequestScope = createAsyncScope(rootContainer)

    containerRegistry.create('globalContainer').register(TestTokenId).toValue('global value')

    await createRequestScope(async () => {
      const container = useScopedContainer()
      container.register(TestTokenId).toValue('async context value')

      const result = injectDependency(TestTokenId)
      expect(result).toBe('async context value')
    })

    // Вне async scope, должно вернуть значение из registry
    const globalResult = injectDependency(TestTokenId)
    expect(globalResult).toBe('global value')
  })
})
