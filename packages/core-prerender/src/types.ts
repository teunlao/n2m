import { type Meta } from '@n2m/shared-types'

export type PrerenderEntry = {
  path: string
  csr: boolean
  ssg: boolean
  meta?: Meta
}

export type PrerenderConfig = PrerenderEntry[]
