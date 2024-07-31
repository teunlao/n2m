import React, { FC, ReactNode } from 'react'

import { useIsOpened } from './use-is-opened'
import { RouteInstance, RouteParams } from '../core'

export interface RouteRecord<Props, Params extends RouteParams> {
  route: RouteInstance<Params> | RouteInstance<Params>[]
  view: React.ComponentType<Props>
  layout?: FC<{ children: ReactNode }>
}

export interface RoutesViewConfig {
  routes: RouteRecord<any, any>[]
  rootLayout?: FC<{ children: ReactNode }>
  otherwise?: React.ComponentType<any>
}

export function createRoutesView<Config extends RoutesViewConfig>(config: Config) {
  return (props: Omit<Config, keyof Config>) => {
    const mergedConfig = { ...config, ...props }
    const routes = mergedConfig.routes.map((routeRecord) => {
      const isOpened = useIsOpened(routeRecord.route)
      return { ...routeRecord, isOpened }
    })

    for (const route of routes) {
      if (route.isOpened) {
        const View = route.view

        const BaseLayout = ({ children }: { children: ReactNode }) => children
        const RootLayout = mergedConfig.rootLayout ?? BaseLayout

        if (route.layout) {
          const Layout = route.layout
          return (
            <RootLayout>
              <Layout>
                <View />
              </Layout>
            </RootLayout>
          )
        }

        return (
          <RootLayout>
            <View />
          </RootLayout>
        )
      }
    }

    if (mergedConfig.otherwise) {
      const Otherwise = mergedConfig.otherwise

      if (mergedConfig.rootLayout) {
        const RootLayout = mergedConfig.rootLayout
        return (
          <RootLayout>
            <Otherwise />
          </RootLayout>
        )
      }

      return <Otherwise />
    }

    return null
  }
}
