import { Avatar, Box, Button, Circle, Float, For, HStack, Link, Menu, Text } from '@chakra-ui/react'
import { RouterLink, useCurrentRoute } from '@n2m/router/react'
import { styled } from '@n2m/plugin-chakra'
import React from 'react'
import { useProviderShape } from '@n2m/core-modules/react'
import { LayoutProviderToken } from './tokens.ts'
import { useUnit } from 'effector-react'
import { AuthProviderToken } from '../auth/tokens.ts'
import { SigninDialogSegment } from '../auth/signin/signin-dialog.segment.tsx'

const StyledContainer = styled(Box, {
  display: 'grid',
  gridTemplateColumns: 'auto',
  gridTemplateRows: 'auto 1fr',
  height: '100dvh',
  width: '100%',
  overflow: 'hidden',
  margin: '0 auto',
  maxW: 'container.xl',
  px: {
    base: 4,
    md: 6,
  },
})

const StyledContentWrapper = styled(Box, {
  width: '100%',
  height: '100%',
  overflow: 'auto',
})

const StyledHeaderWrapper = styled(Box, {
  display: 'grid',
  alignContent: 'center',
  gridColumn: '1',
  h: '4rem',
})

const StyledButton = styled(Button, {
  cursor: 'pointer',
  fontWeight: 700,
})

export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { navigation } = useProviderShape(LayoutProviderToken)
  const { email, isAuthenticated, logoutClicked } = useProviderShape(AuthProviderToken)

  return (
    <StyledContainer>
      <StyledHeaderWrapper>
        <HStack justify="space-between">
          <HStack>
            <For each={navigation}>
              {({ label, route }, idx) => (
                <Link asChild key={idx}>
                  <RouterLink to={route}>
                    <Text
                      fontWeight={700}
                      color={useCurrentRoute().name === useUnit(route.$name) ? 'white' : 'gray.400'}
                    >
                      {label}
                    </Text>
                  </RouterLink>
                </Link>
              )}
            </For>
          </HStack>
          {/*http://localhost:3000/admin/collections/posts/create*/}
          <HStack>
            <Link href="http://localhost:3000/admin/collections/posts/create" target="_blank">
              <StyledButton variant="ghost">Add article</StyledButton>
            </Link>
            {!isAuthenticated ? (
              <SigninDialogSegment />
            ) : (
              <Menu.Root positioning={{ placement: 'bottom-end' }}>
                <Menu.Trigger>
                  <Avatar.Root cursor="pointer" colorPalette="green" variant="subtle">
                    <Avatar.Fallback>{email?.[0]}</Avatar.Fallback>
                    <Float placement="bottom-end" offsetX="1" offsetY="1">
                      <Circle bg="green.500" size="8px" outline="0.2em solid" outlineColor="bg" />
                    </Float>
                  </Avatar.Root>
                </Menu.Trigger>
                <Menu.Positioner overflowY="auto">
                  <Menu.Content minWidth="160px">
                    <Menu.Item value="rename" disabled>
                      Profile
                    </Menu.Item>
                    <Menu.Item cursor="pointer" value="dismiss" onClick={logoutClicked}>
                      Logout
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            )}
          </HStack>
        </HStack>
      </StyledHeaderWrapper>
      <StyledContentWrapper>{children}</StyledContentWrapper>
    </StyledContainer>
  )
}
