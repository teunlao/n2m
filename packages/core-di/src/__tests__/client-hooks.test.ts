// clientHooks.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { injectDependency } from '../client/hooks.ts'
import { containerRegistry } from '../registry.ts'
import { createIdentifier } from '../identifier.ts'

// Мокаем модуль registry
vi.mock('../registry', () => ({
  containerRegistry: {
    get: vi.fn(),
    keys: vi.fn(),
  },
}))

describe('injectDependency (client)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject dependency from registry', () => {
    const token = createIdentifier<string>('test')
    const mockContainer = {
      resolve: vi.fn().mockReturnValue('test value'),
    }

    vi.mocked(containerRegistry.keys).mockReturnValue(['testContainer'] as any)
    vi.mocked(containerRegistry.get).mockReturnValue(mockContainer as any)

    const result = injectDependency(token)

    expect(result).toBe('test value')
    expect(containerRegistry.get).toHaveBeenCalledWith('testContainer')
    expect(mockContainer.resolve).toHaveBeenCalledWith(token)
  })

  it('should return undefined when dependency not found and throwIfNotFound is false', () => {
    const token = createIdentifier<string>('nonExistent')
    const mockContainer = {
      resolve: vi.fn().mockImplementation(() => {
        throw new Error('Not found')
      }),
    }

    vi.mocked(containerRegistry.keys).mockReturnValue(['testContainer'] as any)
    vi.mocked(containerRegistry.get).mockReturnValue(mockContainer as any)

    const result = injectDependency(token)

    expect(result).toBeUndefined()
    expect(containerRegistry.get).toHaveBeenCalledWith('testContainer')
    expect(mockContainer.resolve).toHaveBeenCalledWith(token)
  })

  it('should throw error when dependency not found and throwIfNotFound is true', () => {
    const token = createIdentifier<string>('nonExistent')
    const mockContainer = {
      resolve: vi.fn().mockImplementation(() => {
        throw new Error('Not found')
      }),
    }

    vi.mocked(containerRegistry.keys).mockReturnValue(['testContainer'] as any)
    vi.mocked(containerRegistry.get).mockReturnValue(mockContainer as any)

    expect(() => injectDependency(token, { throwIfNotFound: true })).toThrow(
      'Dependency with token nonExistent not found in any container'
    )
    expect(containerRegistry.get).toHaveBeenCalledWith('testContainer')
    expect(mockContainer.resolve).toHaveBeenCalledWith(token)
  })

  it('should search through multiple containers', () => {
    const token = createIdentifier<string>('test')
    const mockContainer1 = {
      resolve: vi.fn().mockImplementation(() => {
        throw new Error('Not found')
      }),
    }
    const mockContainer2 = {
      resolve: vi.fn().mockReturnValue('test value'),
    }

    vi.mocked(containerRegistry.keys).mockReturnValue(['container1', 'container2'] as any)
    vi.mocked(containerRegistry.get)
      .mockReturnValueOnce(mockContainer1 as any)
      .mockReturnValueOnce(mockContainer2 as any)

    const result = injectDependency(token)

    expect(result).toBe('test value')
    expect(containerRegistry.get).toHaveBeenCalledTimes(2)
    expect(containerRegistry.get).toHaveBeenNthCalledWith(1, 'container1')
    expect(containerRegistry.get).toHaveBeenNthCalledWith(2, 'container2')
    expect(mockContainer1.resolve).toHaveBeenCalledWith(token)
    expect(mockContainer2.resolve).toHaveBeenCalledWith(token)
  })
})
