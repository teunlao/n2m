import { useConfig } from '@n2m/core-config/shared'

type Adapter<T> = () => T

interface RouterAdapterOptions<T> {
  legacy: Adapter<T>
  universal: Adapter<T>
}

export function useRouterAdapter<T>(options: RouterAdapterOptions<T>): T {
  if (!useConfig().newRouter) {
    return options.legacy()
  } else {
    return options.universal()
  }
}
