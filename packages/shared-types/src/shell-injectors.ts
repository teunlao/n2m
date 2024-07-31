export type ShellInjectorHooks = {
  emitToDocumentHtml?: () => Promise<Record<string, string> | undefined> | undefined
  emitToDocumentHead?: () => Promise<string | undefined> | string | undefined
  emitBeforeStreamChunk?: () => Promise<string | undefined> | string | undefined
  emitToDocumentBody?: () => Promise<string | undefined> | string | undefined
  onStreamComplete?: () => Promise<void> | void
}
