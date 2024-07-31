import React from 'react'
import { createToken } from '@n2m/core-di'
import { type ArticlesQueryResource } from './articles.resource.ts'
import { type ArticlesProvider } from './articles.provider.ts'
import { type ArticleSegmentProps } from './article/article.segment.tsx'
import { type ArticleProvider } from './article/article.provider.ts'
import { type ArticleQueryResource } from './article/article.query.resource.ts'
import { type CommentsQueryResource } from './article/comments/comments.query.resource.ts'
import { type CommentsProvider } from './article/comments/comments.provider.ts'
import { type CreateCommentMutation } from './article/comments/create-comment.mutation.ts'

export const ArticlesQueryResourceToken = createToken<ArticlesQueryResource>('ArticlesQueryResource')
export const ArticlesSegmentToken = createToken<React.FC>('ArticlesSegment')
export const ArticlesProviderToken = createToken<ArticlesProvider>('ArticlesProvider')
export const ArticleSegmentToken = createToken<React.FC<ArticleSegmentProps>>('ArticleSegment')
export const ArticleProviderToken = createToken<ArticleProvider>('ArticleProvider')
export const ArticleQueryResourceToken = createToken<ArticleQueryResource>('ArticleQueryResource')
export const CommentsQueryResourceToken = createToken<CommentsQueryResource>('CommentsQueryResource')
export const CommentsSegmentToken = createToken<React.FC>('CommentsSegment')
export const CommentsProviderToken = createToken<CommentsProvider>('CommentsProvider')
export const CreateCommentMutationToken = createToken<CreateCommentMutation>('CreateCommentMutation')
