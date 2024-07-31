import { RequestConfigToken } from '@n2m/core-config/shared'
import { injectDependency } from '@n2m/core-di/next'
import { generateDeviceFlags, resolveInitialLanguage } from '@n2m/shared-utils'
import { ShellInjectorHooksToken } from '@n2m/shared-tokens'
import fs from 'fs'
import { type Context, type Next } from 'hono'
import { createMiddleware } from 'hono/factory'
import path from 'path'
import { injectIntoShell } from '../string-injector'
import { useCookies } from '@n2m/cookies'

export const handlerMiddleware = createMiddleware(async (c, next) => {
  const { renderingMode, pageGenerationMode } = injectDependency(RequestConfigToken)
  if (pageGenerationMode !== 'none' || renderingMode === 'ssr') {
    return await next()
  }

  const url = new URL(c.req.url)

  try {
    return handlePrerenderedRequest({ c, shell: renderingMode, url, next })
  } catch (error) {
    return await next()
  }
})

type PrerenderedRequestOptions = {
  c: Context
  shell: string
  url: URL
  next: Next
}

async function handlePrerenderedRequest({ c, shell, url, next }: PrerenderedRequestOptions) {
  const lang = resolveInitialLanguage({
    cookie: useCookies().get('i18n_redirected'),
    header: c.req.raw.headers.get('accept-language'),
  })

  const device = generateDeviceFlags(c.req.raw.headers, c.req.raw.headers.get('user-agent') || '').isDesktop
    ? 'desktop'
    : 'mobile'

  const shellInjectorHooks = injectDependency(ShellInjectorHooksToken)

  const pageName = url.pathname.replace(/\//g, '--')
  const htmlGenPath = path.join(process.cwd(), 'dist', 'html-gen')

  let renderModeGenPath = path.join(htmlGenPath, shell)

  const filePrefix = shell === 'ssg' ? `${pageName}_${lang}_${device}__` : `${pageName}_${lang}__`

  let htmlFiles

  try {
    htmlFiles = fs
      .readdirSync(renderModeGenPath)
      .filter((file) => file.startsWith(filePrefix) && file.endsWith('.html'))
  } catch (e) {
    shell = 'csr'
    renderModeGenPath = path.join(htmlGenPath, shell)
  }

  if (htmlFiles?.length > 0) {
    try {
      const htmlFilePath = path.join(renderModeGenPath, htmlFiles[0])
      const html = fs.readFileSync(htmlFilePath, 'utf-8')

      return c.html(await injectIntoShell(html, shellInjectorHooks))
    } catch (e) {
      shell = 'csr'
      renderModeGenPath = path.join(htmlGenPath, shell)
    }
  }

  function tryParseIndexPage() {
    try {
      const indexPage = fs
        .readdirSync(renderModeGenPath)
        .filter((file) => file.startsWith(`--_${lang}`) && file.endsWith('.html'))

      if (indexPage.length > 0) {
        const htmlFilePath = path.join(renderModeGenPath, indexPage[0])
        return fs.readFileSync(htmlFilePath, 'utf-8')
      }

      return null
    } catch (e) {
      return null
    }
  }

  if (shell === 'csr') {
    const html = tryParseIndexPage()

    if (html) {
      return c.html(await injectIntoShell(html, shellInjectorHooks))
    }

    return await next()
  }
}
