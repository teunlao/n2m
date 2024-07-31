/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
  readonly VITE_STAGE_MODE: string
  readonly VITE_BACKEND_URL: string
  readonly VITE_SW_VERSIONING: string
  readonly VITE_RENDERING_MODE: string
  readonly VITE_FINGERPRINT_ENABLED: string
  readonly VITE_IS_DEBUG: string
  readonly VITE_INTERCOM_APP_ID: string
  readonly VITE_PRERENDER_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export { ImportMetaEnv, ImportMeta }
