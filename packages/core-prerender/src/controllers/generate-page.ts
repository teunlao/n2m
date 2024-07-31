import { processPages } from '../generator/process-pages.ts'
import { type Context } from 'hono'

export async function generatePage(c: Context) {
  const file = c.req.query('file') as string
  const shell = c.req.query('shell') as string

  const tryGetLocalhost = (url: string) => {
    const urlObj = new URL(url)

    if (urlObj.hostname === 'localhost') {
      return `http://localhost:${urlObj.port}`
    }

    return 'http://localhost:80'
  }

  try {
    await processPages({
      baseUrl: tryGetLocalhost(c.req.url),
      entries: [{ path: file, csr: shell === 'csr', ssg: shell === 'ssg' }],
    })

    return c.json({ message: 'Page regenerated successfully' }, { status: 201 })
  } catch (e) {
    return c.json({ message: 'Failed to regenerate page' }, { status: 500 })
  }
}
