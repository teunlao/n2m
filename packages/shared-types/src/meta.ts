import type { Head } from '@unhead/schema'

// TODO: Add more fields
export type Meta = {
  ru?: Head
  en?: Head
}

export type { Head }

export type MetaConfig = Record<string, Meta>
