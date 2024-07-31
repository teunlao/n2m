import { buildAbsoluteUrl, defineResource } from '@n2m/core-modules'
import { createJsonMutation } from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import { z } from 'zod'

export const logoutMutationResource = defineResource(() => {
  return createJsonMutation({
    request: {
      credentials: 'include',
      method: 'POST',
      url: buildAbsoluteUrl('/api/users/logout'),
      body: {},
    },
    response: {
      contract: zodContract(z.any()),
      status: { expected: [200, 204] },
    },
  })
})

export type LogoutMutationResource = ReturnType<typeof logoutMutationResource>
