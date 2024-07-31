import deepmerge from 'deepmerge'

import { UniversalContext } from '@n2m/shared-types'

export type PluginContext = Partial<UniversalContext>
export { defineRenderPlugin } from '../common.ts'
export type { Config, RenderPlugin, RenderToStreamFn, ServerHandlerOpts, SetOptional } from '../types.ts'
export { getPageCtx, storage } from './ctx.ts'
export { createApp } from './handler.tsx'
export { deepmerge }
export type { ServerHandlerFn, ClientHandlerFn } from '../types.ts'
export { csrHandler } from './csr-handler.ts'
export { type BaseRequestContext } from '../core/base-context'
export { provideRequestContext } from './middlewares/request-context.middleware.ts'
export { createPwaRedirectMiddleware } from './middlewares/pwa-redirect.middleware.ts'
