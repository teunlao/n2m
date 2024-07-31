import { injectIntoShell } from '../server/csr/string-injector'

type CsrHandlerOptions = {
  shell: string
  req: Request
  res: Response
}

export const csrHandler = async ({ shell, req, res }: CsrHandlerOptions) => {
  const { assetsForRequest, renderAssetsToHtml } = await import('@n2m/core-ssr-vite/runtime')

  // const assets = await assetsForRequest(req.url)

  const newShell = await injectIntoShell(shell, {
    emitToDocumentHtml: async () => {
      return {
        app: '123',
      }
    },
  })

  return new Response(shell, { status: 200, headers: { 'Content-Type': 'text/html' } })
}
