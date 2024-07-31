import { createJsonQuery } from '@farfetched/core'
import { z } from 'zod'
import { zodContract } from '@farfetched/zod'
import { defineResource } from '@n2m/core-modules'
import { buildRelativeUrl } from '@n2m/shared-hooks'
import { useClientHeaders } from '../../hooks/use-client-headers.ts'
import { Post } from '../../../payload/payload-types.ts'

const contract = z.object({
  data: z.object({
    Posts: z.object({
      docs: z.array(z.object({})),
    }),
  }),
})

const gql = `query Posts {
  Posts {
    docs {
      id,
      title,
      publishedOn
      populatedAuthors {
        name,
        id
      },
      categories {
        id,
        title
      }
      authors {
        id,
        name
      },
      meta {
        title,
        description,
        image {
          id,
          alt,
          caption,
          filename
        }
      },
      hero {
        type,
        richText,
        media {
          alt,
          width,
          height,
          caption,
          filename
          id
        }
      }
    }
  }
}`

export type ArticlesQueryResourceContract = z.infer<typeof contract>

export const articlesQueryResource = defineResource(() => {
  const query = createJsonQuery({
    name: 'articles',
    request: {
      url: buildRelativeUrl('/api/graphql'),
      headers: useClientHeaders(),
      credentials: 'include',
      method: 'POST',
      body: {
        query: gql,
      },
    },
    initialData: {
      posts: [],
    },
    response: {
      contract: zodContract(contract),
      mapData: (data) => ({
        posts: data.result.data.Posts.docs as Post[],
      }),
    },
  })

  query.finished.failure.watch((error) => {
    console.error('Failed to load articles', error)
  })

  return query
})

export type ArticlesQueryResource = ReturnType<typeof articlesQueryResource>
