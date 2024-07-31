function isClusterMode() {
  return process.env.exec_mode === 'cluster_mode'
}

function startUpdateTimer(updateCache: () => Promise<void>, ttl: number) {
  return setInterval(updateCache, ttl)
}

function clearUpdateTimer(timer: NodeJS.Timeout | null) {
  if (timer) clearInterval(timer)
}

type CacheOptions = {
  key: string
  ttl: number
  loader: () => Promise<any>
  resolveTimeout?: number
}

export function createLoadableCache<T>(options: CacheOptions) {
  let cachedData: T | null = null
  let lastUpdateTime = 0
  let updateTimer: NodeJS.Timeout | null = null
  let initialDataResolve: ((value?: unknown) => void) | null | ((value: void | PromiseLike<void>) => void) = null
  let timeoutExceeded = false

  const resolveTimeout = options.resolveTimeout ?? 500 // Default to 500ms if not provided

  function broadcastUpdate(data: any, updateTime: number) {
    if (isClusterMode() && process.send) {
      process.send({
        type: 'CACHE_UPDATE',
        key: options.key,
        data,
        updateTime,
      })
    }
  }

  function handleMessage(message: any) {
    if (message.type === 'CACHE_UPDATE' && message.key === options.key) {
      cachedData = message.data
      lastUpdateTime = message.updateTime
    }
    resolveWaiter()
  }

  async function updateCache() {
    try {
      cachedData = await options.loader()
      lastUpdateTime = Date.now()
      broadcastUpdate(cachedData, lastUpdateTime)
    } catch (error) {
      console.error(`Error updating cache for key "${options.key}":`, error)
    }
    resolveWaiter()
  }

  function getData() {
    return cachedData
  }

  function initialize() {
    if (isClusterMode()) {
      process.on('message', handleMessage)
      if (process.env.NODE_APP_INSTANCE === '0') {
        updateTimer = startUpdateTimer(updateCache, options.ttl)
        updateCache()
      }
    } else {
      updateTimer = startUpdateTimer(updateCache, options.ttl)
      updateCache()
    }
  }

  function dispose() {
    clearUpdateTimer(updateTimer)
    if (isClusterMode()) {
      process.removeAllListeners('message')
    }
  }

  function waitForDataResolved(timeout: number = resolveTimeout): Promise<void> {
    if (timeoutExceeded || cachedData) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      initialDataResolve = resolve
      setTimeout(() => {
        timeoutExceeded = true
        resolveWaiter()
      }, timeout)
    })
  }

  function resolveWaiter() {
    if (initialDataResolve) {
      initialDataResolve()
      initialDataResolve = null
    }
  }

  initialize()

  return { getData, dispose, waitForDataResolved }
}

export type LoadableCache<T> = ReturnType<typeof createLoadableCache<T>>
