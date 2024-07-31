import { type Context } from 'hono'
import { type Mock } from './define-mock.ts'

type MockRequestOptions = {
  c: Context
  mockFileContent: Mock
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockRequest = async (options: MockRequestOptions) => {
  const mock = typeof options.mockFileContent === 'function' ? options.mockFileContent : options.mockFileContent

  let mockStatus = await mock.status(options.c.req.raw)
  const mockData = await mock.data(options.c.req.raw)

  // @ts-expect-error
  if (mockData?.__status) {
    // @ts-expect-error
    mockStatus = mockData.__status
  }

  if (mock.timeout) {
    await wait(mock.timeout)
  }

  console.groupCollapsed('[mock request] ->', options.c.req.url)
  console.log('response: ', mockData)
  console.log('status: ', mock.status)
  console.log('timeout: ', mock.timeout)
  console.groupEnd()

  return new Response(JSON.stringify(mockData), {
    status: mockStatus ?? 500,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
