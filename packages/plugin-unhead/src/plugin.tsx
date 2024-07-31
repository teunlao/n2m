import { deepmerge, defineRenderPlugin } from '@n2m/core-renderer'
import { InferSeoMetaPlugin } from '@unhead/addons'
import type {
  ActiveHeadEntry,
  CreateHeadOptions,
  Head,
  HeadEntryOptions,
  SchemaAugmentations,
  Unhead,
  UseSeoMetaInput,
} from '@unhead/schema'
import { renderSSRHead } from '@unhead/ssr'
import { createHead, useScript, useSeoMeta as baseUseSeoMeta, useServerSeoMeta as baseUseServerSeoMeta } from 'unhead'
import { useScopedContainer } from '@n2m/core-di'
import { UnheadPluginToken } from './token.ts'

export const PLUGIN_ID = 'unhead' as const

export type UnheadPluginOpts = {
  createHeadOptions?: CreateHeadOptions
}

export type UnheadPluginDependency = {
  useHead: ReturnType<typeof createUseHead>
  useSeoMeta: ReturnType<typeof createUseSeoMeta>
  useBody: ReturnType<typeof createUseBody>
  useScript: typeof useScript
}

export const unheadPlugin = (opts: UnheadPluginOpts = {}) =>
  defineRenderPlugin({
    id: PLUGIN_ID,
    hooksForReq: () => {
      const head = createHead(
        deepmerge(
          {
            plugins: [InferSeoMetaPlugin()],
          },
          opts?.createHeadOptions || {}
        )
      )

      const body: Unhead<SchemaAugmentations> = createHead(
        deepmerge(
          {
            plugins: [InferSeoMetaPlugin()],
          },
          opts?.createHeadOptions || {}
        )
      )

      // TODO: move it to separated service, that started on server start and remove the plugin
      useScopedContainer()
        .register(UnheadPluginToken)
        .toValue({
          useHead: createUseHead(head as any),
          useSeoMeta: createUseSeoMeta(head as any),
          useBody: createUseBody(body as any),
          useScript: useScript,
        })

      return {
        enabled: true,
        common: {
          extendCtx: () => ({
            useHead: createUseHead(head as any),
            useSeoMeta: createUseSeoMeta(head as any),
            useBody: createUseBody(body as any),
            useScript: useScript,
          }),
        },

        server: {
          emitToDocumentHtml: async () => {
            return (await head.resolveTags()).find((t) => t.tag === 'htmlAttrs')?.props
          },
          emitToDocumentHead: async () => {
            const { headTags } = await renderSSRHead(head)

            return headTags
          },
          emitToDocumentBody: async () => {
            const { headTags } = await renderSSRHead(body)

            return headTags
          },
        },
      }
    },
  })

type SupportedHead = Pick<
  Head,
  | 'title'
  | 'titleTemplate'
  | 'templateParams'
  | 'link'
  | 'meta'
  | 'style'
  | 'script'
  | 'noscript'
  | 'bodyAttrs'
  | 'htmlAttrs'
>

type SupportedBody = Pick<Head, 'script' | 'noscript'>

const createUseHead = <T extends SupportedHead>(head: Unhead<T>) => {
  return function useHead(input: T, options: HeadEntryOptions = {}): ActiveHeadEntry<T> | void {
    const isBrowser = !import.meta.env.SSR
    if ((options.mode === 'server' && isBrowser) || (options.mode === 'client' && !isBrowser)) return

    return head.push(input, {
      // transform: whitelistSafeInput,
      mode: import.meta.env.SSR ? 'server' : 'client',
      ...options,
    })
  }
}

const createUseBody = <T extends SupportedBody>(head: Unhead<T>) => {
  return createUseHead(head)
}

const createUseSeoMeta = (head: Unhead) => {
  return function useSeoMeta(input: UseSeoMetaInput): ActiveHeadEntry<any> | void {
    const fn = import.meta.env.SSR ? baseUseServerSeoMeta : baseUseSeoMeta
    return fn(input, { head })
  }
}
