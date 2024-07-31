import {
  AbsoluteCenter,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { injectProvider } from '@n2m/core-modules'
import { useCurrentRoute } from '@n2m/router/react'
import { useUnit } from 'effector-react'
import { useProviderShape, useResourceShape } from '@n2m/core-modules/react'
import { CommentsProviderToken } from './tokens.ts'
import { AuthProviderToken, MeQueryResourceToken, SigninDialogProviderToken } from '../auth/tokens.ts'

export const CommentsSegment = () => {
  const { toggleDialog } = useProviderShape(SigninDialogProviderToken)
  const { isAuthenticated } = useProviderShape(AuthProviderToken)
  const { createComment, isCreateCommentPending } = useProviderShape(CommentsProviderToken)
  const { data } = useResourceShape(MeQueryResourceToken)
  const articleId = useCurrentRoute().params.id
  const userId = data?.user?.id

  const { createCommentsApi } = injectProvider(CommentsProviderToken)
  const { commentText, commentTextChanged, comments, isCommentsLoading } = useUnit(createCommentsApi(articleId))

  const handleCommentSubmit = async () => {
    if (commentText?.trim()) {
      createComment({ articleId, userId: userId!, comment: commentText, status: 'draft' })
      commentTextChanged('')
    }
  }

  const isLoading = isCommentsLoading || isCreateCommentPending

  return (
    <Box p={{ base: 0, md: 5 }}>
      <Heading size="2xl" mb={4}>
        Comments
      </Heading>
      <VStack gap={4} align="stretch">
        {comments.map((comment) => (
          <Box key={comment.id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Stack direction="row" align="center" mb={4} justify="space-between" w="100%">
              <Flex gap={4} align="center">
                <Avatar.Root colorPalette="pink" variant="subtle">
                  <Avatar.Fallback>{comment.populatedUser?.name?.[0]}</Avatar.Fallback>
                </Avatar.Root>
                <Text fontWeight="bold">{comment.populatedUser?.name}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                {new Date(comment.updatedAt).toDateString()}
              </Text>
            </Stack>
            <Text>{comment.comment}</Text>
          </Box>
        ))}

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Stack gap={4}>
            <Textarea
              disabled={isLoading || !isAuthenticated}
              value={commentText}
              onChange={(e) => commentTextChanged(e.target.value)}
              placeholder="Add your comment here..."
              size="md"
            />
            <Button
              variant="solid"
              cursor="pointer"
              onClick={handleCommentSubmit}
              disabled={isLoading || !isAuthenticated}
            >
              <Text opacity={isLoading ? 0 : 1}>Submit</Text>
              <AbsoluteCenter css={{ opacity: isLoading ? 1 : 0 }}>
                <Spinner boxSize="1em" />
              </AbsoluteCenter>
            </Button>

            {!isAuthenticated && (
              <Text color="gray.400" fontSize="md">
                To leave a comment, please{' '}
                <Link variant="underline" onClick={() => toggleDialog(true)}>
                  sign In
                </Link>
              </Text>
            )}
          </Stack>
        </Box>
      </VStack>
    </Box>
  )
}
