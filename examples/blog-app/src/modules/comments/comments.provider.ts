import { defineProvider, injectResource, injectTransientResource, withDescription } from '@n2m/core-modules'
import { useCoreEvents, useCurrentScope } from '@n2m/adapter-effector'
import { createEffect, createEvent, createStore, sample, scopeBind } from 'effector'
import { type CreateCommentParams } from './create-comment.mutation.ts'
import { CommentsQueryResourceToken, CreateCommentMutationToken } from './tokens.ts'
import { defineCachedTransientApi } from '../../helpers/define-cached-transient-api.ts'
import { routes } from '../../router.config.tsx'

const createCommentsApi = defineCachedTransientApi((id: string) => {
  const commentTextChanged = createEvent<string>()
  const $commentText = createStore('')
  $commentText.on(commentTextChanged, (_, text) => text)

  const commentsQuery = injectTransientResource(CommentsQueryResourceToken)
  const isAnyComments = useCurrentScope().getState(commentsQuery.$data).comments.length

  if (!isAnyComments) {
    scopeBind(commentsQuery.start, { scope: useCurrentScope() })({ postId: id })
  }

  return {
    commentsQuery,
    '@@unitShape': () => ({
      comments: commentsQuery.$data.map((data) => data.comments.toReversed()),
      commentTextChanged,
      commentText: $commentText,
      isCommentsLoading: commentsQuery.$pending,
    }),
  }
})

const invalidateCommentsFx = createEffect(() => {
  const articleId = useCurrentScope().getState(routes.Article.$params).id
  return createCommentsApi(articleId).commentsQuery.start({ postId: articleId })
})

export const commentsProvider = defineProvider(() => {
  const createCommentMutation = injectResource(CreateCommentMutationToken)
  const { ssrStarted } = useCoreEvents()
  const createComment = createEvent<CreateCommentParams>()

  withDescription('fetch article once SSR started if the article page was requested', () => {
    sample({
      clock: ssrStarted,
      source: routes.Article.$params,
      filter: routes.Article.$isOpened,
      fn: (params) => ({ id: params.id }),
      target: createEffect<{ id: string }, unknown>(({ id }) => {
        createCommentsApi(id).commentsQuery.start({ postId: id })
      }),
    })
  })

  sample({
    clock: createComment,
    target: createCommentMutation.start,
  })

  sample({
    clock: createCommentMutation.finished.success,
    target: invalidateCommentsFx,
  })

  return {
    createCommentsApi,
    '@@unitShape': () => ({
      createComment,
      isCreateCommentPending: createCommentMutation.$pending,
    }),
  }
})

export type CommentsProvider = ReturnType<typeof commentsProvider>
