import { startTransition } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { useConfig } from '@n2m/core-config/shared'
import { clientHandler } from './app.tsx'
import { renderProps } from './router.config.tsx'

const bootstrap = async () => {
  const start = await clientHandler({ renderProps })

  const root = document.getElementById('root')!
  const { renderingMode, pageGenerationMode } = useConfig()

  startTransition(() => {
    if (renderingMode === 'csr' || pageGenerationMode === 'csr') {
      createRoot(root).render(start())
    } else {
      hydrateRoot(root, start())
    }
  })
}

void bootstrap()
