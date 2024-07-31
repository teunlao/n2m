import type { ReactNode } from 'react'

declare global {
  namespace n2m {
    interface Config {
      jsxElement: ReactNode
    }
  }
}
