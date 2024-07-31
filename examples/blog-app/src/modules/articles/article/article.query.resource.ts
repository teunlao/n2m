import { defineTransientResource } from '@n2m/core-modules'
import { createJsonQuery, declareParams } from '@farfetched/core'
import { useClientHeaders } from '../../../hooks/use-client-headers.ts'
import { zodContract } from '@farfetched/zod'
import { z } from 'zod'
import { buildRelativeUrl } from '@n2m/shared-hooks'
// @ts-ignore
import { Post } from '../../../../payload/payload-types.ts'
import { META } from '../../../graphql/meta.ts'
import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, CONTENT_MEDIA, MEDIA_BLOCK } from '../../../graphql/blocks.ts'

const gql = `
  query Article($id: String!) {
    Post(id: $id) {
      id
      title
      publishedOn,
      createdAt,
      populatedAuthors {
        id,
        name
      }
      ${META},
      layout {
        ${CONTENT}
        ${CALL_TO_ACTION}
        ${CONTENT}
        ${CONTENT_MEDIA}
        ${MEDIA_BLOCK}
        ${ARCHIVE_BLOCK}
      },
      categories {
        id,
        title
      },
    }
  }
`

export const articleQueryResource = defineTransientResource(() => {
  const query = createJsonQuery({
    params: declareParams<{
      id: string
    }>(),
    name: 'article',
    request: {
      credentials: 'include',
      method: 'POST',
      url: buildRelativeUrl('/api/graphql'),
      headers: useClientHeaders(),
      body: (params) => ({
        query: gql,
        variables: params,
      }),
    },
    response: {
      mapData: (data) => data.result.data.Post as Post,
      contract: zodContract(
        z.object({
          data: z.object({
            Post: z.object({}),
          }),
        })
      ),
    },
  })

  query.finished.failure.watch((error) => {
    console.error('Failed to load article', error)
  })

  return query
})

export type ArticleQueryResource = ReturnType<typeof articleQueryResource>
