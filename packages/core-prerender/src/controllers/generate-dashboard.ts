import path from 'path'
import fs from 'fs'
import { type Context } from 'hono'
import { calculateAverageRPS, getMemoryUsage } from '@n2m/shared-utils/performance'

function formatDate(dateString: string) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }

  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', options as any)
}

// async function getCpuUsage() {
//   try {
//     const info = await osu.cpu.usage()
//     console.log('CPU Usage:', info)
//     return info
//   } catch (error) {
//     console.error('Error getting CPU usage:', error)
//   }
// }

export function generateDashboard(c: Context) {
  const secret = c.req.query('secret')

  const htmlGenPath = path.join(process.cwd(), 'dist', 'html-gen')
  const shells = ['ssg', 'csr'] as const
  const memoryUsage = getMemoryUsage()
  // const cpuUsage = await getCpuUsage()
  const requestCounts = globalThis.requestCounts

  const rpsLastSecond = calculateAverageRPS(1, requestCounts)
  const rpsLast10Seconds = calculateAverageRPS(10, requestCounts)
  const rpsLastMinuteSeconds = calculateAverageRPS(60, requestCounts)
  const rpsLast10Minutes = calculateAverageRPS(600, requestCounts)
  const rpsLastHour = calculateAverageRPS(3600, requestCounts)
  const rpsLastDay = calculateAverageRPS(86400, requestCounts)

  let html = `
    <html>
      <head>
        <title>Prerendered Pages Dashboard</title>
        <style>
          body {
            background-color: #292b2b;
            color: white;
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            color: #fff;
            font-size: 24px;
            margin-bottom: 20px;
          }
          
          h2 {
            color: #fff;
            font-size: 20px;
            margin-bottom: 14px;
          }
          
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
            padding: 10px;
            background-color: #444;
            border-radius: 5px;
          }
          li:hover {
            background-color: #555;
          }
          .file-group {
            margin-bottom: 16px;
          }
          .file-group-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: #333;
            border-radius: 5px;
            cursor: pointer;
          }
          .file-group-name {
            font-weight: bold;
            margin-right: 10px;
          }
          .file-group-actions {
            display: flex;
            align-items: center;
          }
          .file-group-toggle {
            font-size: 12px;
            margin-right: 10px;
          }
          .file-group-regenerate {
            background-color: #a735d1;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          }
          .file-group-items {
            display: none;
            margin-top: 10px;
          }
          .file-group-items.show {
            display: block;
          }
          .file-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .file-meta {
            font-size: 14px;
            color: #ccc;
          }
          .regenerate-button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          }
          .loader {
            display: none;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 2px solid #fff;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
            margin-left: 10px;
          }
          
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
          .generate-form {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .generate-input {
            width: 300px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            margin-right: 10px;
          }
          
          .generate-button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          }
          
          .gc-button {
            background-color: #007bff;
            height: 28px;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          }
          
          .restart-node-button {
            background-color: #a735d1;
            height: 28px;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 10px;
          }
          
          .remove-button {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 10px;
          }
          
          .remove-all-button {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 10px;
          }
          
          .regenerate-all-button {
            background-color: #a735d1;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 10px;
          }
          
          .count {
            color: #23ae07;
            font-size: 18px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Prerender Manager | Commit: #<span style="color: #23ae07">${import.meta.env.VITE_VERSION}</span> | PM2:#${process.env.NODE_APP_INSTANCE}</h1>
        <div style="display: flex; flex-direction: row; align-items: center">
          <h3 >Node Process Memory Usage: <span class="count">${memoryUsage}</span> Mb</h3>
          <button style="margin-left: 16px" class="gc-button">Force GC</button>
          <button style="margin-left: 16px" class="restart-node-button">Restart PM2</button>
        </div>
        <h3>Average RPS:</h3>
        <ul style="margin-bottom: 32px;">
          <li>Last second: <span class="count">${rpsLastSecond}</span></li>
          <li>Last 10 seconds: <span class="count">${rpsLast10Seconds}</span></li>
          <li>Last 1 minute: <span class="count">${rpsLastMinuteSeconds.toFixed(3)}</span></li>
          <li>Last 10 minute: <span class="count">${rpsLast10Minutes.toFixed(3)}</span></li>
          <li>Last 1 hour: <span class="count">${rpsLastHour.toFixed(3)}</span></li>
          <li>Last 1 day: <span class="count">${rpsLastDay.toFixed(3)}</span></li>
        </ul>
  `

  for (const shell of shells) {
    const shellPath = path.join(htmlGenPath, shell)

    if (fs.existsSync(shellPath)) {
      const htmlFiles = fs.readdirSync(shellPath)
      const groupedFiles = {}

      htmlFiles.forEach((file) => {
        const [page, date] = file.split('__')
        const [_pageName, locale, device] = page.split('_')
        const pageName = _pageName.replace('--', '/')

        if (!groupedFiles[pageName]) {
          groupedFiles[pageName] = []
        }

        groupedFiles[pageName].push({ file, locale, device, date })
      })

      const groupedFileNames = Array.from(new Set(htmlFiles.map((file) => file.split('_')[0])))

      html += `
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-content: end">
          <h2>
            ${shell.toUpperCase()} Pages
          </h2>
          <div class="generate-form">
            <input type="text" class="generate-input" placeholder="Enter path (e.g., /slots or slots)">
            <button class="generate-button" data-shell="${shell}">Generate</button>
            <button class="remove-all-button" data-files="${groupedFileNames}" data-shell="${shell}">Remove all</button>
            <button class="regenerate-all-button" data-files="${groupedFileNames}" data-shell="${shell}">Regenerate all</button>
          </div>
        </div>
      `

      for (const pageName in groupedFiles) {
        const files = groupedFiles[pageName]

        html += `
          <div class="file-group">
            <div class="file-group-header">
              <span class="file-group-name">${pageName}</span>
              <div class="file-group-actions">
                <span class="file-group-toggle">▼</span>
                <button class="file-group-regenerate" data-shell="${shell}" data-file='${pageName}'>
                  Regenerate
                  <div class="loader"></div>
                </button>
                <button class="file-group-remove remove-button" data-file='${pageName}' data-shell="${shell}">
                  Remove
                  <div class="loader"></div>
                </button>
              </div>
            </div>
            <ul class="file-group-items">
        `

        files.forEach(({ file, locale, device, date }) => {
          const formattedDate = formatDate(date.replace('.html', ''))

          html += `
            <li>
              <div class="file-info">
                <span class="file-meta">${locale} ${device ? '|' : ''} ${device ?? ''}</span>
                <span class="file-meta">Created: ${formattedDate}</span>
              </div>
            </li>
          `
        })

        html += `
            </ul>
          </div>
        `
      }
    }
  }

  html += `
      </body>
      <script>
window.secret = \`${secret}\`
      
        const fileGroupHeaders = document.querySelectorAll('.file-group-header')
        const fileGroupRegenerateButtons = document.querySelectorAll('.file-group-regenerate')
        const regenerateButtons = document.querySelectorAll('.regenerate-button')
        
        fileGroupHeaders.forEach((header) => {
          header.addEventListener('click', (event) => {
            if (event.target.classList.contains('file-group-regenerate')) {
              return
            }
            if (event.target.classList.contains('file-group-remove')) {
              return
            }
            
            const items = header.nextElementSibling
            items.classList.toggle('show')
            const toggle = header.querySelector('.file-group-toggle')
            toggle.textContent = items.classList.contains('show') ? '▲' : '▼'
          })
        })
        
        fileGroupRegenerateButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
            const file = event.target.dataset.file
            const shell = event.target.dataset.shell
            const loader = button.querySelector('.loader')
            
            loader.style.display = 'inline-block'
            
            const response = await fetch(\`/prerender/generate?file=\${file}&shell=\${shell}&secret=\${window.secret}\`)
              if (!response.ok) {
                alert(\`Failed to regenerate page: \${files[0]}\`)
                loader.style.display = 'none'
                return
             }
            
            loader.style.display = 'none'
            alert('Pages regenerated successfully')
            location.reload()
          })
        })
       
        
         const fileGroupRemoveButtons = document.querySelectorAll('.file-group-remove')
        
        fileGroupRemoveButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
            const file = event.target.dataset.file
            const shell = event.target.dataset.shell
            const loader = button.querySelector('.loader')
            
            loader.style.display = 'inline-block'
            
            const response = await fetch(\`/prerender/remove?file=\${file}&shell=\${shell}&secret=\${window.secret}\`)
              if (!response.ok) {
                alert(\`Failed to remove page: \${file}\`)
                loader.style.display = 'none'
                return
              }
            
            loader.style.display = 'none'
            alert('Pages removed successfully')
            location.reload()
          })
        })
        
        const generateButtons = document.querySelectorAll('.generate-button')
        
        generateButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
            const shell = event.target.dataset.shell
            const input = event.target.previousElementSibling
            const path = input.value.trim()
            
            if (path === '') {
              alert('Please enter a valid path')
              return
            }
            
            const formattedPath = path.startsWith('/') ? path : \`/\${path}\`
            
            const response = await fetch(\`/prerender/generate?file=\${formattedPath}&shell=\${shell}&secret=\${window.secret}\`)
            
            if (response.ok) {
              alert('Page generated successfully')
              location.reload()
            } else {
              alert('Failed to generate page')
            }
          })
        })
        
        const gcButton = document.querySelector('.gc-button')
        
        gcButton.addEventListener('click', async () => {
          const response = await fetch(\`/prerender/force-gc?secret=\${window.secret}\`)
          
          if (response.ok) {
            alert('Garbage collection forced')
            location.reload()
          } else {
            alert('Failed to start garbage collection')
          }
        })
        
        const restartNodeButton = document.querySelector('.restart-node-button')
        
        restartNodeButton.addEventListener('click', async () => {
          const response = await fetch(\`/server/restart?secret=\${window.secret}\`)
          
          if (response.ok) {
            alert('Node restarted successfully')
            location.reload()
          } else {
            alert('Failed to restart Node')
          }
        })
        
        const removeAllButtons = document.querySelectorAll('.remove-all-button')
        
        removeAllButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
          console.log('event.target.dataset.files', event.target.dataset.files)
            const files = event.target.dataset.files.split(',')
            const shell = event.target.dataset.shell
            const loader = button.querySelector('.loader')
            
           
            try {
              const promises = files.map(file => fetch(\`/prerender/remove?file=\${file}&shell=\${shell}&secret=\${window.secret}\`))
              await Promise.all(promises)
              alert('Pages removed successfully')
            } catch (error) {
              alert('Failed to remove pages')
            } finally {
              location.reload()
            }         

          })
        })
        
        const regenerateAllButtons = document.querySelectorAll('.regenerate-all-button')
        
        regenerateAllButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
            const files = event.target.dataset.files.split(',')
            const shell = event.target.dataset.shell
            
            try {
              const promises = files.map(file => fetch(\`/prerender/generate?file=\${file.replace('--', '/')}&shell=\${shell}&secret=\${window.secret}\`))
              await Promise.all(promises)
              alert('Pages regenerated successfully')
            } catch (error) {
              alert('Failed to regenerate pages')
            } finally {
              location.reload()
            }
          })
        })
        
      </script>
    </html>
  `

  return c.html(html)
}
