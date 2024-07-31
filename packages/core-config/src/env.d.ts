declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production'
      PORT?: string
      RENDERING_MODE?: string
      FINGERPRINT_ENABLED?: string
      IS_DEBUG?: string
      INTERCOM_APP_ID?: string
      BACKEND_URL?: string
      APP_VERSION?: string
      STAGE_MODE?: string
      PRERENDER_SECRET?: string
    }
  }

  interface Window {
    __STORE__: {
      [key: string]: any
    }
  }
}

export {}
