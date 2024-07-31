import { generatePage, processPages, saveGeneratedHtmlFile } from './generator'
import { handlerMiddleware, rpsMiddleware } from './middlewares'
import { registerRoutes } from './prerender.routes.ts'

async function pregeneratePages() {
  if (import.meta.env.PROD && Number(process.env.NODE_APP_INSTANCE) === 0) {
    try {
      await Promise.all(
        globalThis.prerenderEntries.map((el) =>
          fetch(
            `http://localhost:${process.env.PORT}/prerender/generate?file=${el.path}&shell=csr&secret=${process.env.PRERENDER_SECRET}`
          )
        )
      )

      console.log('Pages generated successfully!')
    } catch (e) {
      console.error('Error generating pages:', e)
    }
  }
}

const generator = {
  generatePage,
  processPages,
  saveGeneratedHtmlFile,
}

const middlewares = {
  handler: handlerMiddleware,
  rps: rpsMiddleware,
}

export const prerender = {
  pregeneratePages,
  registerRoutes,
  generator,
  middlewares,
}
