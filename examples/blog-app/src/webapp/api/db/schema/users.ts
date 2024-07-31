import { pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('user', {
  id: text('id').primaryKey().notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  // email: varchar('email', { length: 255 }).notNull().unique(),
  github_id: varchar('github_id').unique(),
})

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
