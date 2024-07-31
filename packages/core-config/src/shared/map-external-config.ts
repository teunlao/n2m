import type { ExternalConfigRawData } from '../types.ts'

export function mapExternalConfig(data: ExternalConfigRawData) {
  return {}
}

export type MappedExternalConfigRawData = ReturnType<typeof mapExternalConfig>
