import { defineModule, registerProvider, registerResource, registerTransientResource } from '@n2m/core-modules'
import {
  ArticleProviderToken,
  ArticleQueryResourceToken,
  ArticleSegmentToken,
  ArticlesProviderToken,
  ArticlesQueryResourceToken,
  ArticlesSegmentToken,
  CommentsProviderToken,
  CommentsQueryResourceToken,
  CommentsSegmentToken,
  CreateCommentMutationToken,
} from './tokens.ts'
import { articlesQueryResource } from './articles.resource.ts'
import { ArticlesSegment } from './articles.segment.tsx'
import { articlesProvider } from './articles.provider.ts'
import { ArticleSegment } from './article/article.segment.tsx'
import { articleProvider } from './article/article.provider.ts'
import { articleQueryResource } from './article/article.query.resource.ts'
import { commentsQueryResource } from './article/comments/comments.query.resource.ts'
import { CommentsSegment } from './article/comments/comments.segment.tsx'
import { commentsProvider } from './article/comments/comments.provider.ts'
import { createCommentMutation } from './article/comments/create-comment.mutation.ts'

export const MODULE_ID = 'articles' as const

export const articlesModule = defineModule(() => ({
  id: MODULE_ID,
  providers: [
    {
      token: ArticlesQueryResourceToken,
      useLazyFactory: registerResource(articlesQueryResource),
    },
    {
      token: ArticlesProviderToken,
      useLazyFactory: registerProvider(articlesProvider),
      eager: true,
    },
    {
      token: ArticleQueryResourceToken,
      useTransientFactory: registerTransientResource(articleQueryResource),
    },
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
    {
      token: ArticleProviderToken,
      useLazyFactory: registerProvider(articleProvider),
      eager: true,
    },
  ],
  segments: [
    {
      token: ArticleSegmentToken,
      component: ArticleSegment,
    },
    {
      token: ArticlesSegmentToken,
      component: ArticlesSegment,
    },
    {
      token: CommentsSegmentToken,
      component: CommentsSegment,
    },
  ],
}))
