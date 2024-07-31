import * as path from 'node:path'
import fs from 'fs'

type Options = {
  html: string
  pageName: string
  mode: 'ssg' | 'csr'
}

export function saveGeneratedHtmlFile({ html, pageName, mode }: Options) {
  const distPath = path.join(process.cwd(), 'dist')
  const htmlGenPath = path.join(distPath, 'html-gen')
  const outputPath = path.join(htmlGenPath, mode)

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  const oldFiles = fs.readdirSync(outputPath).filter((file) => file.startsWith(`${pageName}__`))
  oldFiles.forEach((file) => {
    const filePath = path.join(outputPath, file)
    fs.unlinkSync(filePath)
  })

  const newFileName = `${pageName}__${new Date().toJSON()}.html`
  const newFilePath = path.join(outputPath, newFileName)

  fs.writeFileSync(newFilePath, html)
}
