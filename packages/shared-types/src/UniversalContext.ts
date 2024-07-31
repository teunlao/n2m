// !!! IMPORTANT !!! DO not change these imports, they are used to infer the Ctx type and it should be relative
// @ts-ignore
import { bootstrapCorePlugins } from '../../core-entry/src/shared/default-render-plugins.tsx'
// @ts-ignore
import { createApp } from '../../core-entry/src/server/handler.ts'

/**
 * this function is only needed to dynamically infer the Ctx type
 * because we don't have a way to export the type of the ctx from the app instance
 */
const __infer__createApp = () =>
  // @ts-ignore
  createApp({
    // @ts-expect-error
    plugins: bootstrapCorePlugins(),
  })

export type UniversalContext = typeof __infer__createApp extends () => infer R
  ? R extends { ctx: infer C }
    ? C
    : never
  : never
