export interface Identifier<T> {
  __type: T
  value: string
}

export interface Container {
  __getInternalDeps: () => Record<string, any>
  register: <T>(identifier: Identifier<T>) => {
    toValue: (value: T) => void
    toFactory: (factory: Factory<T>, options?: { lifecycle: 'singleton' | 'transient' }) => void
    toLazyFactory: (factory: Factory<T>) => void
  }
  resolve: <T>(identifier: Identifier<T>) => T
  replace: <T>(identifier: Identifier<T>) => {
    withValue: (value: T) => void
    withFactory: (factory: Factory<T>, options?: { lifecycle: 'singleton' | 'transient' }) => void
    withLazyFactory: (factory: Factory<T>) => void
  }
  autoWire: <T, Args extends any[]>(factory: (...args: Args) => T) => T
  createScope: () => Container
  debug: () => string
}

export type Factory<T> = (container: Container) => T
