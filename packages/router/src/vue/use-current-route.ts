import { useRouter } from '../react'
import { useUnit } from 'effector-vue/composition'

export function useCurrentRouteRef() {
  const activeRoutes = useUnit(useRouter().$activeRoutes)
  return useUnit(activeRoutes.value[0]['@@unitShape']())
}

export function useCurrentRoute() {
  // eslint-disable-next-line effector/no-getState
  const activeRoutes = useRouter().$activeRoutes.getState()
  return activeRoutes[0]
}
