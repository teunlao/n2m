import { useConfig } from '@n2m/core-config/shared'

export function buildAbsoluteUrl(url: string) {
  const { forwardUrl } = useConfig()

  return `${forwardUrl.origin}${url}`
}
