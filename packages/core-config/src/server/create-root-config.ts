import { ConfigBuilder } from '../core/ConfigBuilder.ts'
import { RenderingMode } from '../types.ts'

export function createRootConfig() {
  const isDev = import.meta.env.DEV
  const isProd = import.meta.env.PROD

  return new ConfigBuilder()
    .addOption('appVersion', {
      envKey: 'VERSION',
      defaultValue: '',
    })
    .addOption('port', { envKey: 'PORT', defaultValue: 3000, transform: Number })
    .addOption('renderingMode', {
      envKey: 'RENDERING_MODE',
      defaultValue: 'default' as RenderingMode,
    })
    .addOption('perfAutoCsrSwitchMemoryThreshold', {
      envKey: 'PERF_AUTO_CSR_SWITCH_MEMORY_THRESHOLD',
      defaultValue: 1500,
      serialize: false,
    })
    .addOption('perfAutoCsrSwitchRpsLastSecondThreshold', {
      envKey: 'PERF_AUTO_CSR_SWITCH_RPS_LAST_SECOND_THRESHOLD',
      defaultValue: 15,
      serialize: false,
    })
    .addOption('perfAutoCsrSwitchRpsLast10SecondsThreshold', {
      envKey: 'PERF_AUTO_CSR_SWITCH_RPS_LAST_10_SECONDS_THRESHOLD',
      defaultValue: 10,
      serialize: false,
    })
    .addOption('perfAutoCsrSwitchRpsLastMinuteThreshold', {
      envKey: 'PERF_AUTO_CSR_SWITCH_RPS_LAST_MINUTE_THRESHOLD',
      defaultValue: 8,
      serialize: false,
    })
    .addOption('perfAutoCsrSwitchRpsLast10MinutesThreshold', {
      envKey: 'PERF_AUTO_CSR_SWITCH_RPS_LAST_10_MINUTES_THRESHOLD',
      defaultValue: 6,
      serialize: false,
    })
    .addOption('perfAutoCsrSwitchRpsLastHourThreshold', {
      envKey: 'PERF_AUTO_CSR_SWITCH_RPS_LAST_HOUR_THRESHOLD',
      defaultValue: 4,
      serialize: false,
    })
    .addOption('isDebug', {
      envKey: 'IS_DEBUG',
      defaultValue: false,
    })
    .addOption('apiTimeoutServer', {
      defaultValue: 1000,
      envKey: 'API_TIMEOUT_SERVER',
    })
    .addOption('apiTimeoutClient', {
      defaultValue: 10000,
      envKey: 'API_TIMEOUT_CLIENT',
    })
    .addOption('isServer', { defaultValue: true })
    .addOption('isClient', { defaultValue: false })
    .addOption('isDev', { defaultValue: isDev })
    .addOption('isProd', { defaultValue: isProd })
    .build()
}

export type RootConfig = ReturnType<typeof createRootConfig>
