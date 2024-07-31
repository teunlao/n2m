type BaseRequestContextOptions = {
  req: Request
}

export function createBaseRequestContext({ req }: BaseRequestContextOptions) {
  return {
    req,
    // TODO rename and refactor; it's used only for Vue Wrapper rendering as async storage data
    render: { pending: false, result: '', timeout: false },
  }
}

export type BaseRequestContext = ReturnType<typeof createBaseRequestContext>
