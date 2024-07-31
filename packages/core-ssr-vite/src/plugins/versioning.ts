import { Plugin } from 'vite'
import { execSync } from 'child_process'

function runCommand(command: string, options = {}) {
  try {
    return execSync(command, options)?.toString()?.trim()
  } catch (error) {
    console.error(`Error when executing command ${command}:`, error)
    return ''
  }
}

// function processDirectory(directory: string, processFile: (filePath: string) => void) {
//   fs.readdirSync(directory).forEach((file) => {
//     const fullPath = path.join(directory, file)
//     if (fs.lstatSync(fullPath).isDirectory()) {
//       processDirectory(fullPath, processFile)
//     } else if (fullPath.match(/\.(json|js|css)$/i)) {
//       processFile(fullPath)
//     }
//   })
// }
//
// function addVersionToImports(filePath: string, hash: string, ignoreList?: string[]) {
//   let content = fs.readFileSync(filePath, 'utf8')
//
//   // we replace all .endsWith(".css") with .match(/\.css(\?.*)?$/) to support dynamic css imports with query params
//   content = content.replace(/\.endsWith\("\.css"\)/g, '.match(/\\.css(\\?.*)?$/)')
//
//   const unifiedRegex = /(["'](?:\.\/|\.\.\/|\/)*(?:assets\/)?(?:chunk|asset|entry)-[\w.-]+(?:\.js|\.css))(["'])/g
//
//   content = content.replace(unifiedRegex, (match, p1, p2) => {
//     return `${p1}?v=${hash}${p2}`
//   })
//
//   fs.writeFileSync(filePath, content, 'utf8')
// }

export default function versioningPlugin(customHash = runCommand('git rev-parse HEAD')?.substring(0, 7)) {
  return {
    name: 'vite-plugin-add-version-to-imports',
    enforce: 'post',
    config(config) {
      config.define = {
        ...config.define,
        'import.meta.env.VITE_VERSION': JSON.stringify(customHash),
      }

      return config
    },
    // apply: 'build',
    // closeBundle() {
    //   const distDir = path.resolve(process.cwd(), './dist')
    //
    //   processDirectory(distDir, (filePath: string) => {
    //     addVersionToImports(filePath, customHash)
    //   })
    // },
  } as Plugin
}
