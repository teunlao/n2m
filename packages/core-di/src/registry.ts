import { type Container } from './types'
import { createContainer } from './container'

type ContainerMap = Map<string, Container>
export const ROOT_CONTAINER_KEY = 'root'
const containerMap: ContainerMap = new Map()

export const containerRegistry = {
  create(name: string, parentName?: string, options?: { strict?: boolean }): Container {
    if (containerMap.has(name)) {
      if (options?.strict) {
        throw new Error(`Container with name '${name}' already exists`)
      }

      return containerMap.get(name)!
    }

    const parentContainer = parentName ? this.get(parentName) : undefined
    const container = createContainer(parentContainer)
    containerMap.set(name, container)
    return container
  },

  get(name: string): Container {
    const container = containerMap.get(name)
    if (!container) {
      throw new Error(`Container with name '${name}' not found`)
    }
    return container
  },

  remove(name: string): void {
    if (!containerMap.has(name)) {
      throw new Error(`Container with name '${name}' not found`)
    }
    containerMap.delete(name)
  },

  has(name: string): boolean {
    return containerMap.has(name)
  },

  reset(): void {
    containerMap.clear()
  },

  keys(): IterableIterator<string> {
    return containerMap.keys()
  },

  debug() {
    let output = 'Container Registry Debug Information:\n'

    for (const [name, container] of containerMap) {
      output += `\nContainer: ${name}\n`
      output += container
        .debug()
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n')
    }
    console.log(output)
  },
}

export const registry = containerRegistry
