import { generateState } from 'arctic'
import { github } from '../auth.ts'
import { getCookie, setCookie } from 'hono/cookie'
import { Context } from 'hono'

const loginGithub = async (c: Context) => {
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
}

export const authController = {
  loginGithub,
}
