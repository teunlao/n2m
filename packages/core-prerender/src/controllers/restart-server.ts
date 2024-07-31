import { type Context } from 'hono'
import { spawn } from 'node:child_process'
import pm2 from 'pm2'

export function restartServer(c: Context) {
  const restartProcess = () => {
    spawn(process.argv[1], process.argv.slice(2), {
      detached: true,
      stdio: 'inherit',
    }).unref()
    process.exit()
  }
  restartProcess()

  return c.json({ message: 'Server restarted' }, { status: 201 })
}

export function restartPm2(c: Context) {
  pm2.connect((err) => {
    if (err) {
      console.error('Ошибка подключения к PM2:', err)
      return
    }

    pm2.reload('all', (err, apps) => {
      pm2.disconnect()
      if (err) {
        console.error('Failed to restart processes:', err)
        return c.json({ error: err }, { status: 200 })
      } else {
        console.log('Processes restarted successfully')
        return c.json({ success: true }, { status: 200 })
      }
    })
  })
}
