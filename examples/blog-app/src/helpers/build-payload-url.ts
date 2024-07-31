export function buildPayloadUrl(path: string) {
  if (import.meta.env.SSR) {
    return `${process.env.PAYLOAD_URL}${path}`
  }

  return `${import.meta.env.VITE_PAYLOAD_URL}${path}`
}
