import { type RequestConfig } from './server'
import { type ExternalConfig } from './shared'

export type RenderingMode = 'ssr' | 'csr' | 'ssg' | 'default'
export type PageGenerationMode = 'none' | 'ssg' | 'csr'

export type ResultConfig = ExternalConfig &
  RequestConfig & {
    isExternalConfigLoaded: boolean
  }

export type ExternalConfigRawData = {}
