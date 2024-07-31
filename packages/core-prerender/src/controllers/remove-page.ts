import { type Context } from 'hono'
import path from 'node:path'
import fs from 'fs'

export async function removePage(c: Context) {
  console.log('removePage', c.req.query('file'))
  const distPath = path.join(process.cwd(), 'dist')
  const htmlGenPath = path.join(distPath, 'html-gen')
  const fileName = c.req.query('file') as string
  const shell = c.req.query('shell') as string
  const outputPath = path.join(htmlGenPath, shell)

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  const actualFileName = fileName.replace(/\//g, '--')

  const oldFiles = fs.readdirSync(outputPath).filter((file) => {
    const isIndexPage = actualFileName === '--'

    if (isIndexPage) return file.startsWith('--_')

    return file.startsWith(`${actualFileName}`)
  })

  oldFiles.forEach((file) => {
    const filePath = path.join(outputPath, file)
    fs.unlinkSync(filePath)
  })

  return c.json({ message: 'Page removed successfully' }, { status: 201 })
}
