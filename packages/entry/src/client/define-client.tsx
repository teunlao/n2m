import React, { startTransition } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { useConfig } from '@n2m/core-config/shared'

interface ClientConfig {
  clientHandler: (props: any) => Promise<() => React.ReactNode>
  renderProps: any
  onInit?: () => Promise<void>
}

export function defineClient(clientConfig: ClientConfig) {
  async function hydrateApp(start: () => React.ReactNode, root: HTMLElement) {
    hydrateRoot(root, start())
  }

  async function renderApp(start: () => React.ReactNode, root: HTMLElement) {
    createRoot(root).render(start())
  }

  async function initializeClient() {
    if (clientConfig.onInit) {
      await clientConfig.onInit()
    }

    const start = await clientConfig.clientHandler({
      renderProps: clientConfig.renderProps,
    })

    const root = document.getElementById('root')!

    const { renderingMode, pageGenerationMode, isTelegramMiniApp } = useConfig()

    startTransition(() => {
      if (renderingMode === 'csr' || pageGenerationMode === 'csr' || isTelegramMiniApp) {
        renderApp(start, root)
      } else {
        hydrateApp(start, root)
      }
    })
  }

  return initializeClient
}
