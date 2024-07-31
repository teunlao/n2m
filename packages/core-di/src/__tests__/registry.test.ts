import { describe, it, expect, beforeEach } from 'vitest'
import { containerRegistry } from '../registry.ts'
import { createIdentifier } from '../identifier.ts'
import { strict } from 'node:assert'

describe('containerRegistry', () => {
  beforeEach(() => {
    containerRegistry.reset()
  })

  it('should create and retrieve a container', () => {
    const container = containerRegistry.create('test')
    expect(container).toBeDefined()
    expect(containerRegistry.get('test')).toBe(container)
  })

  it('should throw when creating a container with an existing name', () => {

    containerRegistry.create('test1', undefined, { strict: true })

    expect(() => containerRegistry.create('test1', undefined, { strict: true })).toThrow("Container with name 'test1' already exists")
  })

  it('should create a child container', () => {
    containerRegistry.create('parent')
    const childContainer = containerRegistry.create('child', 'parent')
    expect(childContainer).toBeDefined()
  })

  it('should throw when creating a child container with non-existing parent', () => {
    expect(() => containerRegistry.create('child', 'non-existing')).toThrow(
      "Container with name 'non-existing' not found"
    )
  })

  it('should remove a container', () => {
    containerRegistry.create('test')
    containerRegistry.remove('test')
    expect(containerRegistry.has('test')).toBe(false)
  })

  it('should throw when removing a non-existing container', () => {
    expect(() => containerRegistry.remove('non-existing')).toThrow("Container with name 'non-existing' not found")
  })

  it('should check if a container exists', () => {
    containerRegistry.create('test')
    expect(containerRegistry.has('test')).toBe(true)
    expect(containerRegistry.has('non-existing')).toBe(false)
  })

  it('should resolve a dependency from a container', () => {
    const container = containerRegistry.create('test')
    const testId = createIdentifier<string>('test')
    container.register(testId).toValue('test value')

    expect(container.resolve(testId)).toBe('test value')
  })

  it('should reset the registry', () => {
    containerRegistry.create('test1')
    containerRegistry.create('test2')
    containerRegistry.reset()
    expect(containerRegistry.has('test1')).toBe(false)
    expect(containerRegistry.has('test2')).toBe(false)
  })

  it('should support container scopes', () => {
    const parentContainer = containerRegistry.create('parent')
    const parentId = createIdentifier<string>('parentValue')
    parentContainer.register(parentId).toValue('parent')

    const childContainer = containerRegistry.create('child', 'parent')
    const childId = createIdentifier<string>('childValue')
    childContainer.register(childId).toValue('child')

    expect(childContainer.resolve(parentId)).toBe('parent')
    expect(childContainer.resolve(childId)).toBe('child')
    expect(() => parentContainer.resolve(childId)).toThrow()
  })

  it('should support auto-wiring', () => {
    const container = containerRegistry.create('test')
    const depId = createIdentifier<string>('dependency')
    container.register(depId).toValue('auto-wired value')

    const result = container.autoWire((dependency: string) => `Result: ${dependency}`)
    expect(result).toBe('Result: auto-wired value')
  })
})
