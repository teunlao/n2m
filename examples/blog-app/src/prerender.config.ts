import { type PrerenderConfig } from '@n2m/core-prerender'
import { metaConfig } from './meta.config.ts'

export const prerenderConfig: PrerenderConfig = [
  {
    path: '/',
    csr: true,
    ssg: true,
    meta: metaConfig.index,
  },
  {
    path: '/articles',
    csr: true,
    ssg: true,
    meta: metaConfig.articles,
  },
]
