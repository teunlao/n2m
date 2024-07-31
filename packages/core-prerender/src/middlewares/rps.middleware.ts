import { createMiddleware } from 'hono/factory'
import { useConfig } from '@n2m/core-config/shared'
import { injectDependency } from '@n2m/core-di'
import { ShellInjectorHooksToken } from '@n2m/shared-tokens'
import superjson from 'superjson'
import { calculateAverageRPS, getMemoryUsage, oneDay } from '@n2m/shared-utils/performance'

const requestCounts = new Uint32Array(oneDay)

export const rpsMiddleware = createMiddleware(async (c, next) => {
  globalThis.requestCounts = requestCounts
  const currentSecond = Math.floor(Date.now() / 1000) % oneDay
  requestCounts[currentSecond]++

  const shellInjectorHooks = injectDependency(ShellInjectorHooksToken)

  const config = useConfig()

  function switchToCSR() {
    config.renderingMode = 'csr'

    shellInjectorHooks.pop()
    shellInjectorHooks.push({
      emitToDocumentBody() {
        return `
        <script>
          window.__STORE__ = window.__STORE__ || {}
          window.__STORE__.config = ${superjson.stringify(config)}
        </script>
      `
      },
    })
  }

  const isMemoryUsageHigh = getMemoryUsage() > config.perfAutoCsrSwitchMemoryThreshold
  const rpsLastSecondIsHigh = calculateAverageRPS(1, requestCounts) > config.perfAutoCsrSwitchRpsLastSecondThreshold
  const rpsLast10SecondIsHigh =
    calculateAverageRPS(10, requestCounts) > config.perfAutoCsrSwitchRpsLast10SecondsThreshold
  const rpsLastLastMinuteIsHigh =
    calculateAverageRPS(60, requestCounts) > config.perfAutoCsrSwitchRpsLastMinuteThreshold

  const rpsLast10MinutesIsHigh =
    calculateAverageRPS(600, requestCounts) > config.perfAutoCsrSwitchRpsLast10MinutesThreshold
  const rpsLastHourIsHigh = calculateAverageRPS(3600, requestCounts) > config.perfAutoCsrSwitchRpsLastHourThreshold

  if (
    config.renderingMode === 'ssr' &&
    config.perfAutoCsrSwitchEnabled &&
    config.pageGenerationMode === 'none' &&
    [
      isMemoryUsageHigh,
      rpsLastSecondIsHigh,
      rpsLast10SecondIsHigh,
      rpsLastLastMinuteIsHigh,
      rpsLast10MinutesIsHigh,
      rpsLastHourIsHigh,
    ].some(Boolean)
  ) {
    switchToCSR()
  }

  await next()
})
