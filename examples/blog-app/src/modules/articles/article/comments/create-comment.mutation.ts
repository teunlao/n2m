import { buildAbsoluteUrl, defineResource } from '@n2m/core-modules'
import { createJsonMutation, declareParams } from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import { z } from 'zod'

export type CreateCommentParams = {
  comment: string
  articleId: string
  status: string
  userId: string
}

export const createCommentMutation = defineResource(() => {
  return createJsonMutation({
    params: declareParams<CreateCommentParams>(),
    name: 'createComment',
    response: {
      mapData: (data) => data,
      contract: zodContract(z.any()),
    },
    request: {
      query: {},
      url: buildAbsoluteUrl('/api/comments'),
      method: 'POST',
      body: (params) => ({
        comment: params.comment,
        doc: params.articleId,
        status: params.status,
        user: params.userId,
      }),
    },
  })
})

export type CreateCommentMutation = ReturnType<typeof createCommentMutation>
