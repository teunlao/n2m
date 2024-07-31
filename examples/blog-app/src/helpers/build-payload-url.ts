export function buildPayloadUrl(path: string) {
  if (import.meta.env.SSR) {
    const { PAYLOAD_URL } = process.env
    if (PAYLOAD_URL) {
      return `${PAYLOAD_URL}${path}`
    }
    return `${import.meta.env.VITE_PAYLOAD_URL}${path}`
  }

  return `${import.meta.env.VITE_PAYLOAD_URL}${path}`
}
