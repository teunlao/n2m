import { ConfigBuilder } from '../core/ConfigBuilder.ts'

export function createExternalConfig(rawConfig: Record<string, any>) {
  return new ConfigBuilder(rawConfig)
    .addOption('test', {
      key: 'test',
      defaultValue: null,
    })
    .build()
}

export type ExternalConfig = ReturnType<typeof createExternalConfig>
