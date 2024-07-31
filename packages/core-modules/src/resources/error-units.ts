import { type HttpError, JsonApiRequestError } from '@farfetched/core'

type HttpErrorDetailed = {
  status: number
  statusText: string
  response: {
    code: number
    message: string
  }
}

export function httpError(error?: JsonApiRequestError | HttpError): HttpErrorDetailed {
  return {
    // @ts-ignore unknown property
    status: error?.status,
    // @ts-ignore unknown property
    statusText: error?.statusText,
    response: {
      // @ts-ignore unknown property
      code: error?.response?.code,
      // @ts-ignore unknown property
      message: error?.response?.message,
    },
  }
}
