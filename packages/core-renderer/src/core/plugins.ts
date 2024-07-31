import { CommonHooks, RenderPlugin, type ServerHooks } from '../types.ts'

export const splitPluginsByPriority = (plugins: RenderPlugin<any>[]) => {
  const beforeModulesPlugins: RenderPlugin<any>[] = []
  const afterModulesPlugins: RenderPlugin<any>[] = []

  for (const plugin of plugins) {
    if (plugin.priority === 'before_modules') {
      beforeModulesPlugins.push(plugin)
    } else if (plugin.priority === 'after_modules') {
      afterModulesPlugins.push(plugin)
    } else {
      beforeModulesPlugins.push(plugin)
    }
  }

  return [beforeModulesPlugins, afterModulesPlugins]
}

export const createCommonHooks = () => ({
  extendCtx: [] as NonNullable<CommonHooks['extendCtx']>[],
  renderApp: [] as NonNullable<CommonHooks['renderApp']>[],
  wrapApp: [] as NonNullable<CommonHooks['wrapApp']>[],
})

export const createServerHooks = () => [] as ServerHooks[]

type processPluginsOptions = {
  plugins: RenderPlugin<any>[]
  req?: Request
  res?: Response
  meta?: n2m.ReqMeta
  renderProps?: n2m.RenderProps | {}
  ctx: any
  container: any
  commonHooks: ReturnType<typeof createCommonHooks>
  serverHooks?: ReturnType<typeof createServerHooks>
}

export async function processPlugins({
  plugins,
  req,
  res,
  meta,
  renderProps,
  ctx,
  container,
  commonHooks,
  serverHooks,
}: processPluginsOptions) {
  for (const p of plugins ?? []) {
    if (p.mode === 'server' && !import.meta.env.SSR) continue
    if (p.mode === 'client' && import.meta.env.SSR) continue

    if (p.hooksForReq) {
      const hooks = await p?.hooksForReq({
        req: req!,
        res,
        meta,
        renderProps: renderProps as any,
        ctx,
        container,
      })
      if (!hooks) continue

      if (!hooks.enabled) continue

      if (hooks.common) {
        for (const name in hooks.common) {
          const hook = hooks.common[name as keyof CommonHooks]
          if (!hook) continue
          commonHooks?.[name as keyof CommonHooks]!.push(hook as any)

          if (name === 'extendCtx') {
            Object.assign(ctx, hook() || {})
          }
        }
      }

      if (serverHooks && hooks.server) {
        serverHooks.push(hooks.server)
      }
    }
  }
}

type processPluginsClients = {
  plugins: RenderPlugin<any>[]
  req?: Request
  renderProps?: n2m.RenderProps | {}
  ctx: any
  container: any
  commonHooks: ReturnType<typeof createCommonHooks>
}

export async function processPluginsClient({
  plugins,
  ctx,
  renderProps,
  container,
  commonHooks,
  req,
}: processPluginsClients) {
  for (const p of plugins ?? []) {
    if (p.mode === 'server' && !import.meta.env.SSR) continue
    if (p.mode === 'client' && import.meta.env.SSR) continue

    if (p.hooksForReq) {
      const hooks = await p?.hooksForReq({
        req: req!,
        renderProps: renderProps as any,
        ctx,
        container,
      })
      if (!hooks) continue

      if (!hooks.enabled) continue

      if (hooks.common) {
        for (const name in hooks.common) {
          const hook = hooks.common[name as keyof CommonHooks]
          if (!hook) continue
          commonHooks[name as keyof CommonHooks]!.push(hook as any)

          if (name === 'extendCtx') {
            Object.assign(ctx, hook() || {})
          }
        }
      }
    }
  }
}
