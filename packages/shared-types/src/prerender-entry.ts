import { type Head } from '@unhead/schema'

export type Entry = {
  path: string
  csr: boolean
  ssg: boolean
  head?: {
    ru: Head
    en: Head
  }
}
