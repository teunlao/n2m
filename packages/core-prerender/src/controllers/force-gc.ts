import { type Context } from 'hono'

export function forceGarbageCollection(c: Context): Response {
  if (global.gc) {
    global.gc()
    return c.json({ message: 'Garbage collection forced' }, { status: 201 })
  } else {
    console.warn('No GC hook! Start your program as `node --expose-gc file.js`.')
  }

  return c.json({ message: 'Garbage collection not available' }, { status: 500 })
}
