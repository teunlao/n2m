import { createMiddleware } from 'hono/factory'
import { mockRequest } from './mock-request.ts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// @ts-ignore
const isMocksEnabled = !!process.env.MOCKS_ENABLED || !!import.meta.env?.VITE_MOCKS_ENABLED
const convertToFilename = (path: string) => path.replaceAll('/', '_').replace('proxy', 'api')
const checkShouldUseMocksForPath = (path: string, env) => {
  const isAllPathsMocked = () => {
    return env === '*'
  }

  const isCurrentPathMocked = () => {
    return env?.split(',').includes(path)
  }

  return isAllPathsMocked() || isCurrentPathMocked()
}

export const mocksMiddleware = createMiddleware(async (c, next) => {
  if (!isMocksEnabled) {
    return next()
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  let mockFileContent: any = null
  const adaptedPath = convertToFilename(c.req.path)

  try {
    if (
      checkShouldUseMocksForPath(
        c.req.path,
        // @ts-ignore
        process.env.CUSTOM_MOCKED_PATHS ?? import.meta.env?.VITE_CUSTOM_MOCKED_PATHS
      )
    ) {
      const customMockForPathProd = path.join(process.cwd(), './custom-mocks', adaptedPath + '.js')
      const customMockForPathDev = path.join(process.cwd(), './custom-mocks', adaptedPath + '.ts')
      const customMockForPath = import.meta.env.PROD ? customMockForPathProd : customMockForPathDev
      try {
        mockFileContent = (await import(/* @vite-ignore */ customMockForPath))?.default
      } catch (e) {
        return next()
      }
    }
  } catch (e) {
    return next()
  }

  if (!mockFileContent) {
    try {
      if (
        !checkShouldUseMocksForPath(
          c.req.path,
          // @ts-ignore
          process.env.DEFAULT_MOCKED_PATHS ?? import.meta.env.VITE_DEFAULT_MOCKED_PATHS
        )
      ) {
        return next()
      }

      if (!c.req.path.includes('banners')) {
        return next()
      }

      const defaultMockForPathProd = path.join(
        __dirname,
        '../../../packages/core-mocks/src',
        './default-mocks',
        adaptedPath + '.js'
      )
      const defaultMockForPathDev = path.join(__dirname, '../src', './default-mocks', adaptedPath + '.js')
      const defaultMockForPath = import.meta.env.PROD ? defaultMockForPathProd : defaultMockForPathDev

      console.log('defaultMockForPath', defaultMockForPath)
      try {
        mockFileContent = (await import(/* @vite-ignore */ defaultMockForPath))?.default
      } catch (e) {
        console.log('ERORR>>>', e)
        return next()
      }

      console.log('mockFileContent', mockFileContent)
    } catch (e) {
      // console.log('[core-mocks]: error when resolving default mock file', e)
    }
  }

  if (!mockFileContent) {
    return next()
  }

  return mockRequest({
    c,
    mockFileContent,
  })
})
