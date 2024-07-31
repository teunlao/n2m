import { useUnit } from 'effector-react'
import { RouteInstance } from '../core'

export function useIsOpened(route: RouteInstance<any> | RouteInstance<any>[]) {
  return Array.isArray(route) ? useUnit(route.map((route) => route.$isOpened)).some(Boolean) : useUnit(route.$isOpened)
}
