import { registry } from '@n2m/core-di/next'
import axios from 'axios'
import { createExternalConfig, type ExternalConfigRawData, RequestConfigToken, useConfig } from '../shared'
import { mapExternalConfig } from '../shared'

export async function processExternalConfig() {
  const config = useConfig()
  const { isExternalConfigLoaded, forwardUrl } = config

  if (isExternalConfigLoaded) {
    return
  }

  const TIMEOUT = 3000
  const MAX_RETRIES = 2

  const fetchWithRetry = async (url: string, retries: number = 0): Promise<ExternalConfigRawData> => {
    try {
      const response = await axios.get<ExternalConfigRawData>(url, { timeout: TIMEOUT })
      return response.data
    } catch (error) {
      if (retries < MAX_RETRIES) {
        console.warn(`Request failed, retrying... (${retries + 1}/${MAX_RETRIES})`)
        return fetchWithRetry(url, retries + 1)
      }
      throw error
    }
  }

  try {
    const response = await fetchWithRetry(`${forwardUrl.origin}/api/v2/init`)

    if (!response) {
      throw new Error('No data received from API')
    }

    const externalConfig = createExternalConfig(mapExternalConfig(response))

    const resultedConfig = {
      ...config,
      ...externalConfig,
    }

    window.__STORE__.config = resultedConfig

    registry.get('root').replace(RequestConfigToken).withValue(resultedConfig)

    return resultedConfig
  } catch (e) {
    console.error('Failed to load external config after retries:', e)
    return config
  }
}
