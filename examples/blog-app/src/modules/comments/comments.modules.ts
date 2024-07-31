import { defineModule, registerProvider, registerResource, registerTransientResource } from '@n2m/core-modules'
import {} from '../articles/tokens.ts'
import { commentsQueryResource } from './comments.query.resource.ts'
import { createCommentMutation } from './create-comment.mutation.ts'
import { commentsProvider } from './comments.provider.ts'
import { CommentsSegment } from './comments.segment.tsx'
import { MODULE_ID } from '../articles/articles.module.ts'
import {
  CommentsProviderToken,
  CommentsQueryResourceToken,
  CommentsSegmentToken,
  CreateCommentMutationToken,
} from './tokens.ts'

export const CommentsModules = defineModule(() => ({
  id: MODULE_ID,
  providers: [
    {
      token: CommentsQueryResourceToken,
      useTransientFactory: registerTransientResource(commentsQueryResource),
    },
    {
      token: CreateCommentMutationToken,
      useTransientFactory: registerResource(createCommentMutation),
    },
    {
      token: CommentsProviderToken,
      useLazyFactory: registerProvider(commentsProvider),
      eager: true,
    },
  ],
  segments: [
    {
      token: CommentsSegmentToken,
      component: CommentsSegment,
    },
  ],
}))
