import { generateState, OAuth2RequestError } from 'arctic'
import { getCookie, setCookie } from 'hono/cookie'
import { generateId } from 'lucia'
import { Hono } from 'hono'
import { Context } from '../middleware/context.ts'
import { github, lucia } from '../auth.ts'
import { db } from '../db/client.ts'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

export const authRouter = new Hono<Context>()

authRouter.get('/me', async (c) => {
  const user = c.get('user')
  return c.json(user, { status: user ? 200 : 401 })
})

authRouter.get('/login/github', async (c) => {
  const state = generateState()
  const url = await github.createAuthorizationURL(state)
  setCookie(c, 'github_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'Lax',
  })
  return c.redirect(url.toString())
})

authRouter.get('/login/github/callback', async (c) => {
  console.log('callback')
  const code = c.req.query('code')?.toString() ?? null

  console.log('code', code)

  const state = c.req.query('state')?.toString() ?? null

  console.log('state', state)
  const storedState = getCookie(c).github_oauth_state ?? null

  console.log('storedState', storedState)
  if (!code || !state || !storedState || state !== storedState) {
    console.log('bad request')
    return c.body(null, 400)
  }
  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const githubUser: GitHubUser = await githubUserResponse.json()

    const existingUsers = await db.select().from(users).where(eq(users.github_id, githubUser.id)).execute()
    console.log('existingUser', existingUsers)
    const user = existingUsers?.[0]

    if (user) {
      console.log('we have user', user.id)
      const session = await lucia.createSession(user.id.toString(), {}).catch((e) => {
        console.log('error', e)
      })
      console.log('session', session)
      c.header('Set-Cookie', lucia.createSessionCookie(session!.id).serialize(), { append: true })

      console.log('we are redirecting')
      return c.redirect('http://localhost:5554')
    }

    console.log('no user')
    console.log('githubUser', githubUser)

    const userId = generateId(15)

    const result = await db
      .insert(users)
      .values({
        id: userId,
        github_id: githubUser.id,
        username: githubUser.login,
      })
      .execute()
    console.log('result', result)

    const session = await lucia.createSession(userId, {})
    c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), { append: true })
    return c.redirect('/')
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
      // invalid code
      return c.body(null, 400)
    }
    return c.body(null, 500)
  }
})

interface GitHubUser {
  id: string
  login: string
}
