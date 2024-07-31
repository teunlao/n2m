import { Identifier, useScopedContainer } from '@n2m/core-di'

type UseDependencyOptions = {
  silent?: boolean
}

export function useDependency<T>(
  serviceIdentifier: Identifier<T>,
  options: UseDependencyOptions = { silent: false }
): T {
  try {
    const container = useScopedContainer()
    return container.resolve(serviceIdentifier)
  } catch (e) {
    if (options.silent) {
      return null as T
    }

    throw e
  }
}
