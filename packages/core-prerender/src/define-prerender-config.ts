import type { PrerenderEntry } from './types.ts'

type Language = 'ru' | 'en'

type MetaTag = {
  name: string
  content: string
}

type HeadConfig = {
  title: string
  meta: MetaTag[]
}

type LocalizedHeadConfig = {
  [key in Language]: HeadConfig
}

type PrerenderConfig = Omit<PrerenderEntry, 'meta'> & {
  head?: LocalizedHeadConfig
}

export function definePrerenderConfig(config: PrerenderConfig[]): PrerenderEntry[] {
  return config
}
