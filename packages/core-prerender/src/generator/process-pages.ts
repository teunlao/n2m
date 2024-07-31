import { generatePage } from './generate-page.ts'
import { saveGeneratedHtmlFile } from './save-generated-html-file.ts'
import { createHead } from 'unhead'
import { renderSSRHead } from '@unhead/ssr'
import type { ActiveHeadEntry, Head, HeadEntryOptions, Unhead } from '@unhead/schema'
import { injectIntoShell } from '../string-injector'
import { type PrerenderEntry } from '../types.ts'

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

const createUseHead = <T extends SupportedHead>(head: Unhead<T>) => {
  return function useHead(input: T, options: HeadEntryOptions = {}): ActiveHeadEntry<T> | void {
    return head.push(input, {
      mode: 'server',
      ...options,
    })
  }
}

type ProcessPagesOptions = {
  baseUrl: string
  entries: PrerenderEntry[]
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const languages = ['en', 'ru'] as const
const devices = ['desktop', 'mobile'] as const

function sanitizePageName(pageName: string) {
  return pageName.replace(/\//g, '--')
}

export async function processPages({ entries, baseUrl }: ProcessPagesOptions) {
  console.log('Processing pages...', entries)

  for (const entry of entries) {
    const fullUrl = `${baseUrl}${entry.path}`

    if (entry.csr) {
      for (const language of languages) {
        const csrHtml = await generatePage({ url: fullUrl, mode: 'csr', language })
        const sanitizedPageName = `${sanitizePageName(entry.path)}_${language}`

        const head = createHead()

        const useHead = createUseHead(head)

        if (!entry.meta) {
          const entries = globalThis.prerenderEntries

          const globalEntry = entries.find((e: PrerenderEntry) => e.path === entry.path)

          if (globalEntry.meta) {
            useHead(globalEntry.meta[language])
          }
        }

        if (entry.meta) {
          useHead(entry.meta[language])
        }

        const { headTags } = await renderSSRHead(head, {
          omitLineBreaks: true,
        })

        saveGeneratedHtmlFile({
          html: await injectIntoShell(csrHtml, {
            emitToDocumentHead: () => headTags,
          }),
          pageName: sanitizedPageName,
          mode: 'csr',
        })
      }
    }

    if (entry.ssg) {
      for (const language of languages) {
        for (const device of devices) {
          const ssgHtml = await generatePage({ url: fullUrl, mode: 'ssg', language, device })

          const sanitizedPageName = `${sanitizePageName(entry.path)}_${language}_${device}`
          saveGeneratedHtmlFile({
            html: ssgHtml,
            pageName: sanitizedPageName,
            mode: 'ssg',
          })
        }
      }
    }

    await wait(100)
  }
}
