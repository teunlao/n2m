import { Lucia, TimeSpan } from 'lucia'
import { NeonHTTPAdapter } from '@lucia-auth/adapter-postgresql'
import { sql } from './db/client.ts'
import { type User } from './db/schema'
import { GitHub } from 'arctic'

class CustomNodeHttpAdapter extends NeonHTTPAdapter {
  override async getSessionAndUser(
    sessionId: string
  ): ReturnType<(typeof NeonHTTPAdapter)['prototype']['getSessionAndUser']> {
    const [session, user] = await super.getSessionAndUser(sessionId)

    if (session) {
      session.expiresAt = new Date(session.expiresAt)
    }

    return [session, user]
  }
}

const adapter = new CustomNodeHttpAdapter(sql, {
  user: 'user',
  session: 'session',
})

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, 'w'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      // email: attributes.email,
    }
  },
})

export const github = new GitHub('Ov23liZveeHpm89EcpMO', 'bb82e6b0ff17829e798f75d1ae53bb6d09735b05')

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<User, 'id'>
  }
}
