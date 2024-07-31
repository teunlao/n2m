import { buildAbsoluteUrl, defineResource } from '@n2m/core-modules'
import { createJsonQuery } from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import { z } from 'zod'
import { useClientHeaders } from '../../hooks/use-client-headers.ts'
import { buildPayloadUrl } from '../../helpers/build-payload-url.ts'

const contract = z.object({
  collection: z.string().optional(),
  exp: z.number().optional(),
  token: z.string().optional(),
  user: z
    .object({
      id: z.string().optional(),
      email: z.string().optional(),
      name: z.string().optional(),
      updatedAt: z.string().optional(),
    })
    .optional(),
})

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
  return createJsonQuery({
    name: 'meQuery',
    request: {
      headers: useClientHeaders(),
      method: 'GET',
      url: buildAbsoluteUrl('/api/users/me'),
      credentials: 'include',
    },
    response: {
      contract: zodContract(contract),
      mapData: (data) => data,
    },
  })
})

export type MeQueryResource = ReturnType<typeof meQueryResource>
