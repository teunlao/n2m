import { useRouter } from '../shared/router-provider.tsx'
import { useUnit } from 'effector-react'

export function useCurrentRoute() {
  const router = useRouter()
  const routeShape = useUnit(useRouter().$firstActiveRoute)
  const homeRoute = router.routes.find((v) => v.path === '/')!.route

  const homeShape = useUnit(homeRoute!['@@unitShape']())
  const getUnitShape = () => useUnit(routeShape['@@unitShape']())

  if (!routeShape) return homeShape as ReturnType<typeof getUnitShape>

  return useUnit(routeShape['@@unitShape']()) as ReturnType<typeof getUnitShape>
}
