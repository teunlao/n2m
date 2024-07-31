import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from './users.ts'

export const sessions = pgTable(
  'session',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (table) => {
    return {
      nameIdx: index('session_user_id_idx').on(table.userId),
    }
  }
)

export type UserSession = typeof sessions.$inferSelect
export type InsertUserSession = typeof sessions.$inferInsert

export const insertUserSessionSchema = createInsertSchema(sessions)
export const selectUserSessionSchema = createSelectSchema(sessions)
