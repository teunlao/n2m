export function getMemoryUsage() {
  const bytesToMB = (bytes, decimals = 2) => {
    if (bytes === 0) return '0'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    return (bytes / (k * k)).toFixed(dm)
  }

  return parseFloat(bytesToMB(process.memoryUsage().rss))
}
