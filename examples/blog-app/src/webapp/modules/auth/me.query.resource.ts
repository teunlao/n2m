import { buildAbsoluteUrl, defineResource } from '@n2m/core-modules'
import { createJsonQuery } from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import { z } from 'zod'
import { useClientHeaders } from '../../hooks/use-client-headers.ts'

const contract = z.object({
  collection: z.string(),
  exp: z.number(),
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    updatedAt: z.string(),
  }),
})

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
