import { type PrerenderConfig } from '@n2m/core-prerender'
import { metaConfig } from './meta.config.ts'

export const prerenderConfig: PrerenderConfig = [
  {
    path: '/',
    csr: false,
    ssg: false,
    meta: metaConfig.index,
  },
  {
    path: '/articles',
    csr: false,
    ssg: false,
    meta: metaConfig.articles,
  },
]
