import { useConfig } from '@n2m/core-config/shared'

export const buildRelativeUrl = (url: string) => {
  const { forwardUrl } = useConfig()

  return `${forwardUrl.origin}${url}`
}
