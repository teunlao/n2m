type MockHandler = (req: Request) => object | Promise<object>

interface MockConfig {
  status: (req: Request) => number | Promise<number>
  data: (req: Request) => object | Promise<object>
  timeout?: number
}

export interface Mock {
  status: (req: Request) => number | Promise<number>
  data: MockHandler
  timeout: number
}

export function defineMock(config: MockConfig): Mock {
  return {
    status: config.status || 200,
    data: config.data,
    timeout: config.timeout || 0,
  }
}
