import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from './users'
import { articles } from './articles'

export const comments = pgTable('comment', {
  id: text('id').primaryKey().notNull(),
  body: text('body').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id),
  articleId: text('article_id')
    .notNull()
    .references(() => articles.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
})

export type Comment = typeof comments.$inferSelect
export type InsertComment = typeof comments.$inferInsert

export const insertCommentSchema = createInsertSchema(comments)
export const selectCommentSchema = createSelectSchema(comments)
