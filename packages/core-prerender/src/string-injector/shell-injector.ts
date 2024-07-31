import {
  chainTransformers,
  createHtmlAttributeInsertion,
  createScriptToBodyStartTransformStream,
  createTagInsertion,
} from './injectors.ts'

export type ShellInjectorHooks = {
  emitToDocumentHtml?: () => Promise<Record<string, string> | undefined> | undefined
  emitToDocumentHead?: () => Promise<string | undefined> | string | undefined
  emitBeforeStreamChunk?: () => Promise<string | undefined> | string | undefined
  emitToDocumentBody?: () => Promise<string | undefined> | string | undefined
  onStreamComplete?: () => Promise<void> | void
}

export async function injectIntoShell(
  shell: string,
  originalHooks: ShellInjectorHooks | ShellInjectorHooks[]
): Promise<string> {
  const htmlFns: NonNullable<ShellInjectorHooks['emitToDocumentHtml']>[] = []
  const headFns: NonNullable<ShellInjectorHooks['emitToDocumentHead']>[] = []
  const chunkFns: NonNullable<ShellInjectorHooks['emitBeforeStreamChunk']>[] = []
  const bodyFns: NonNullable<ShellInjectorHooks['emitToDocumentBody']>[] = []
  const completeFns: NonNullable<ShellInjectorHooks['onStreamComplete']>[] = []

  const hooks = Array.isArray(originalHooks) ? originalHooks : [originalHooks]

  for (const hook of hooks) {
    if (hook.emitToDocumentHtml) htmlFns.push(hook.emitToDocumentHtml)
    if (hook.emitToDocumentHead) headFns.push(hook.emitToDocumentHead)
    if (hook.emitBeforeStreamChunk) chunkFns.push(hook.emitBeforeStreamChunk)
    if (hook.emitToDocumentBody) bodyFns.push(hook.emitToDocumentBody)
    if (hook.onStreamComplete) completeFns.push(hook.onStreamComplete)
  }

  return chainTransformers(shell, [
    createHtmlAttributeInsertion(async () => {
      const work = htmlFns.map((fn) => fn())
      return (await Promise.all(work)).reduce((acc, curr) => ({ ...acc, ...curr }), {}) ?? {}
    }),
    createTagInsertion('head', async () => {
      const work = headFns.map((fn) => fn())
      return (await Promise.all(work)).filter(Boolean).join('')
    }),
    createTagInsertion('body', async () => {
      const work = bodyFns.map((fn) => fn())
      return (await Promise.all(work)).filter(Boolean).join('')
    }),
    createScriptToBodyStartTransformStream(),
  ])
}
