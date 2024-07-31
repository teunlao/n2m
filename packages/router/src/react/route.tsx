import React from 'react'

import { useIsOpened } from './use-is-opened'
import { RouteInstance, RouteParams } from '../core'

interface Props<Params extends RouteParams> {
  route: RouteInstance<Params> | RouteInstance<Params>[]
  view: React.ComponentType
}

export function Route<Params extends RouteParams>({ route, view: Component }: Props<Params>) {
  const isOpened = useIsOpened(route)

  if (isOpened) {
    return <Component />
  }

  return null
}
