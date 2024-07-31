import React, { Suspense } from 'react'
import { defineRouter } from '@n2m/router/react'
import { createRoute } from '@n2m/router'
import { Box } from '@chakra-ui/react'
import { SegmentContainerCached } from '@n2m/core-modules/react'
import { ArticleSegmentToken, ArticlesSegmentToken } from './modules/articles/tokens.ts'
import { LayoutSegmentToken } from './modules/layout/tokens.ts'
import { metaConfig } from './meta.config.ts'

const MainLayout = ({ children }: React.PropsWithChildren) => (
  <SegmentContainerCached token={LayoutSegmentToken}>{children}</SegmentContainerCached>
)

export const renderProps = defineRouter({
  rootLayout: ({ children }) => (
    <Suspense>
      <Box bg="bg.darkest">{children}</Box>
    </Suspense>
  ),
  // TODO implement 404 page
  otherwise: () => <Box>404</Box>,
  routes: {
    Home: {
      layout: MainLayout,
      route: createRoute({ name: 'Home', meta: metaConfig.index }),
      view: () => <Box>Home</Box>,
      path: '/',
    },
    Articles: {
      layout: MainLayout,
      route: createRoute({ name: 'Articles', meta: metaConfig.articles }),
      view: () => <SegmentContainerCached token={ArticlesSegmentToken} />,
      path: '/articles',
    },
    Article: {
      layout: MainLayout,
      route: createRoute({ name: 'Article' }),
      view: () => <SegmentContainerCached token={ArticleSegmentToken} />,
      path: '/articles/:id',
    },
  },
})

export const { routes } = renderProps
