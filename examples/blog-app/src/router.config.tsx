import React, { Suspense } from 'react'
import { defineRouter } from '@n2m/router/react'
import { createRoute } from '@n2m/router'
import { Box, Flex, Heading, Link, Text, VStack } from '@chakra-ui/react'
import { SegmentContainerCached } from '@n2m/core-modules/react'
import { ArticleSegmentToken, ArticlesSegmentToken } from './modules/articles/tokens.ts'
import { LayoutSegmentToken } from './modules/layout/tokens.ts'
import { metaConfig } from './meta.config.ts'
import { useConfig } from '@n2m/core-config/shared'

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
      view: () => (
        <Box>
          <Box p={5}>
            <VStack align="start" gap={5}>
              <Heading as="h1" size="xl">
                Blog app example
              </Heading>
              <Flex>
                <Text mr={2}>App deployed at:</Text>
                <Link href="https://n2m.onrender.com/">
                  <Text color="green.300">https://n2m.onrender.com</Text>
                </Link>
              </Flex>

              <Flex>
                <Text mr={2}>Payload CMS deployed at:</Text>
                <Link href="https://n2m-payload.onrender.com/">
                  <Text color="green.300">https://n2m-payload.onrender.com</Text>
                </Link>
              </Flex>

              <Flex>
                <Text mr={2}>Current commit hash: </Text>
                <Text fontWeight={700} color="green.300">
                  {useConfig().appVersion}
                </Text>
              </Flex>
            </VStack>
          </Box>
        </Box>
      ),
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
