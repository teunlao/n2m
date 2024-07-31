import { buildAbsoluteUrl, defineResource } from '@n2m/core-modules'
import { createJsonMutation, declareParams } from '@farfetched/core'
import { z } from 'zod'
import { zodContract } from '@farfetched/zod'

const contract = z.object({
  exp: z.number(),
  message: z.string(),
  token: z.string(),
  user: z.object({
    createdAt: z.string(),
    email: z.string(),
    id: z.string(),
    loginAttempts: z.number(),
    name: z.string(),
    roles: z.array(z.string()),
    updatedAt: z.string(),
  }),
})

export type SigninContract = z.infer<typeof contract>

export const signinMutationResource = defineResource(() => {
  return createJsonMutation({
    params: declareParams<{ email: string; password: string }>(),
    request: {
      method: 'POST',
      url: buildAbsoluteUrl('/api/users/login'),
      body: ({ email, password }) => ({ email, password }),
    },
    response: {
      contract: zodContract(contract),
      status: { expected: [200, 204] },
    },
  })
})

export type SigninMutationResource = ReturnType<typeof signinMutationResource>
