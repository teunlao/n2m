let handlersRegistered = false

export function handleUncaughtNodeExceptions() {
  if (!handlersRegistered) {
    process.on('uncaughtException', (error) => {
      import.meta.env.DEV && console.error('uncaughtException', error)
    })

    process.on('unhandledRejection', (reason, promise) => {
      import.meta.env.DEV && console.error('uncaughtException', promise, 'reason:', reason)
    })

    handlersRegistered = true
  }
}
