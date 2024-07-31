import { buildAbsoluteUrl, defineResource } from '@n2m/core-modules'
import { createJsonMutation, declareParams } from '@farfetched/core'
import { z } from 'zod'
import { zodContract } from '@farfetched/zod'
import { buildPayloadUrl } from '../../../helpers/build-payload-url.ts'

const contract = z.any()

export type SigninContract = z.infer<typeof contract>

const gql = `
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        email
      }
      exp
      token
    }
  }
`

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
