import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from './users'

export const articles = pgTable('article', {
  id: text('id').primaryKey().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  status: varchar('status', { enum: ['published', 'draft'] })
    .notNull()
    .default('draft'),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
})

export type Article = typeof articles.$inferSelect
export type InsertArticle = typeof articles.$inferInsert

export const insertArticleSchema = createInsertSchema(articles)
export const selectArticleSchema = createSelectSchema(articles)
