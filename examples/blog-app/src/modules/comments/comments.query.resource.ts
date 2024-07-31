import { createJsonQuery, declareParams } from '@farfetched/core'
import { z } from 'zod'
import { zodContract } from '@farfetched/zod'
import { defineTransientResource } from '@n2m/core-modules'
import { buildRelativeUrl } from '@n2m/shared-hooks'
import { useClientHeaders } from '../../hooks/use-client-headers.ts'
import { COMMENTS_BY_DOC } from '../../graphql/comments.ts'
// @ts-ignore
import { Comment } from '../../../../payload-app/src/payload-types.ts'

const contract = z.object({
  data: z.object({
    Comments: z.object({
      docs: z.array(z.object({})),
    }),
  }),
})

export type CommentsQueryResourceContract = z.infer<typeof contract>

export const commentsQueryResource = defineTransientResource(() => {
  const query = createJsonQuery({
    params: declareParams<{
      postId: string
    }>(),
    name: 'comments',
    request: {
      url: buildRelativeUrl('/api/graphql'),
      headers: useClientHeaders(),
      credentials: 'include',
      method: 'POST',
      body: (params) => ({
        query: COMMENTS_BY_DOC,
        variables: {
          doc: params.postId,
        },
      }),
    },
    initialData: {
      comments: [],
    },
    response: {
      contract: zodContract(contract),
      mapData: (data) => ({
        comments: data.result.data.Comments.docs as Comment[],
      }),
    },
  })

  query.finished.failure.watch((error) => {
    console.error('Failed to load articles', error)
  })

  return query
})

export type CommentsQueryResource = ReturnType<typeof commentsQueryResource>
