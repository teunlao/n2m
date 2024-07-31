import { createToken } from '@n2m/core-di'
import React from 'react'
import { CommentsQueryResource } from './comments.query.resource.ts'
import { CommentsProvider } from './comments.provider.ts'
import { CreateCommentMutation } from './create-comment.mutation.ts'

export const CommentsQueryResourceToken = createToken<CommentsQueryResource>('CommentsQueryResource')
export const CommentsSegmentToken = createToken<React.FC>('CommentsSegment')
export const CommentsProviderToken = createToken<CommentsProvider>('CommentsProvider')
export const CreateCommentMutationToken = createToken<CreateCommentMutation>('CreateCommentMutation')
