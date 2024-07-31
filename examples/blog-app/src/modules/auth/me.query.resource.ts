import { buildAbsoluteUrl, defineResource } from '@n2m/core-modules'
import { createJsonMutation, createJsonQuery } from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import { z } from 'zod'
import { useClientHeaders } from '../../hooks/use-client-headers.ts'
import { buildPayloadUrl } from '../../helpers/build-payload-url.ts'

const contract = z.any()

const gql = `query Me {
  meUser {
    user {
      email,
      id,
      name
    }
    collection
    exp
    token
  }
}`

export type MeQueryResourceContract = z.infer<typeof contract>

export const meQueryResource = defineResource(() => {
  const mutation = createJsonQuery({
    name: 'meQuery',
    request: {
      headers: useClientHeaders(),
      method: 'POST',
      url: buildAbsoluteUrl('/api/graphql'),
      credentials: 'include',
      body: () => ({
        query: gql,
      }),
    },
    response: {
      contract: zodContract(contract),
      mapData: (data) => data.result.data.meUser,
    },
  })

  mutation.finished.failure.watch((error) => {
    console.error('Me query failed', error)
  })

  return mutation
})

export type MeQueryResource = ReturnType<typeof meQueryResource>
