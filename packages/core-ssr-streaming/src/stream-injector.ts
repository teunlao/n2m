import {
  chainTransformers,
  createBodyInsertionStream,
  createBufferedTransformStream,
  createHtmlAttributeInsertionStream,
  createHTMLInsertionStream,
  createMoveSuffixStream,
  createScriptToBodyStartTransformStream,
  createTagInsertionStream,
  insertShellIntoStream,
} from './stream-utils.ts'

export type StreamInjectorHooks = {
  emitToDocumentHtml?: () => Promise<Record<string, string> | undefined> | undefined
  emitToDocumentHead?: () => Promise<string | undefined> | string | undefined
  emitBeforeStreamChunk?: () => Promise<string | undefined> | string | undefined
  emitToDocumentBody?: () => Promise<string | undefined> | string | undefined
  onStreamComplete?: () => Promise<void> | void
}

export function injectIntoStream(
  req: Request,
  renderStream: ReadableStream,
  originalHooks: StreamInjectorHooks | StreamInjectorHooks[],
  shell?: string
): ReadableStream<Uint8Array> {
  const htmlFns: NonNullable<StreamInjectorHooks['emitToDocumentHtml']>[] = []
  const headFns: NonNullable<StreamInjectorHooks['emitToDocumentHead']>[] = []
  const chunkFns: NonNullable<StreamInjectorHooks['emitBeforeStreamChunk']>[] = []
  const bodyFns: NonNullable<StreamInjectorHooks['emitToDocumentBody']>[] = []
  const completeFns: NonNullable<StreamInjectorHooks['onStreamComplete']>[] = []

  const hooks = Array.isArray(originalHooks) ? originalHooks : [originalHooks]

  for (const hook of hooks) {
    if (hook.emitToDocumentHtml) htmlFns.push(hook.emitToDocumentHtml)
    if (hook.emitToDocumentHead) headFns.push(hook.emitToDocumentHead)
    if (hook.emitBeforeStreamChunk) chunkFns.push(hook.emitBeforeStreamChunk)
    if (hook.emitToDocumentBody) bodyFns.push(hook.emitToDocumentBody)
    if (hook.onStreamComplete) completeFns.push(hook.onStreamComplete)
  }

  return chainTransformers(renderStream, [
    // Buffer everything to avoid flushing too frequently, and to avoid injecting into the middle of a tag (important!)

    createBufferedTransformStream(),
    insertShellIntoStream(shell ?? ''),
    createHtmlAttributeInsertionStream(async () => {
      const work = htmlFns.map((fn) => fn())
      return (
        (await Promise.all(work)).reduce(
          (acc, curr) => {
            if (curr) {
              return { ...acc, ...curr }
            }
            return acc
          },
          {} as Record<string, string>
        ) ?? {}
      )
    }),
    // Insert arbitrary HTML into the document head (triggers once)
    headFns.length
      ? createTagInsertionStream('</head>', async () => {
          const work = headFns.map((fn) => fn())
          return (await Promise.all(work)).filter(Boolean).join('')
        })
      : null,
    // Insert arbitrary HTML into the document body on first flush (triggers once)
    bodyFns.length
      ? createBodyInsertionStream(async () => {
          const work = bodyFns.map((fn) => fn())
          return (await Promise.all(work)).filter(Boolean).join('')
        })
      : null,
    createScriptToBodyStartTransformStream(),
    // Insert generated tags on flush (can trigger 1-n times)
    chunkFns.length
      ? createHTMLInsertionStream(
          async () => {
            const work = chunkFns.map((fn) => fn())
            return (await Promise.all(work)).filter(Boolean).join('')
          },
          { loc: 'before' }
        )
      : null,
    // Close tags should always be deferred to the end
    createMoveSuffixStream(
      '</div></body></html>',
      completeFns.length
        ? async () => {
            const work = completeFns.map((fn) => fn())
            await Promise.all(work)
          }
        : undefined
    ),
  ])
}
