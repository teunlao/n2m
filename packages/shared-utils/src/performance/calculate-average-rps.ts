export const oneDay = 86400

export function calculateAverageRPS(interval: number, requestCounts: Uint32Array) {
  try {
    const currentTime = Date.now()
    const currentSecond = Math.floor(currentTime / 1000) % oneDay
    const startSecond = (currentSecond - interval + oneDay) % oneDay

    let totalRequests = 0
    for (let i = 0; i < interval; i++) {
      const index = (startSecond + i) % oneDay
      totalRequests += requestCounts[index]
    }

    return totalRequests / interval
  } catch (e) {
    return 0
  }
}
