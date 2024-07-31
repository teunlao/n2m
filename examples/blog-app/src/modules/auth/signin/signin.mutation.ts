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
  const mutation = createJsonMutation({
    params: declareParams<{ email: string; password: string }>(),
    request: {
      method: 'POST',
      credentials: 'include',
      url: buildAbsoluteUrl('/api/graphql'),
      body: (params) => ({
        query: gql,
        variables: {
          email: params.email,
          password: params.password,
        },
      }),
    },
    response: {
      contract: zodContract(contract),
      status: { expected: [200, 204] },
    },
  })

  mutation.finished.failure.watch((error) => {
    console.error('Signin mutation failed', error)
  })

  return mutation
})

export type SigninMutationResource = ReturnType<typeof signinMutationResource>
