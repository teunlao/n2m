import { createMiddleware } from 'hono/factory'
import { lucia } from '../auth.ts'

export const sessionMiddleware = createMiddleware(async (c, next) => {
  const sessionId = lucia.readSessionCookie(c.req.header('Cookie') ?? '')
  if (!sessionId) {
    c.set('user', null)
    c.set('session', null)
    return next()
  }

  const { session, user } = await lucia.validateSession(sessionId)

  console.log('{ session, user }', { session, user })
  if (session && session.fresh) {
    c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), { append: true })
  }
  if (!session) {
    c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), { append: true })
  }
  c.set('session', session)
  c.set('user', user)
  return next()
})
