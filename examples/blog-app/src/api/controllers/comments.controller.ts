import { db } from '../db/client'
import { Context } from 'hono'
import { comments, insertCommentSchema } from '../db/schema/comments.ts'

export const createComment = async (c: Context) => {
  const body = await c.req.json()
  const parsedBody = insertCommentSchema.parse(body)

  const newComment = await db.insert(comments).values(parsedBody).returning().get()
  return c.json(newComment, { status: 201 })
}

export const getCommentsByArticle = async (c: Context) => {
  const articleId = c.req.param('articleId')

  const articleComments = await db.select().from(comments).where(eq(comments.articleId, articleId)).all()
  return c.json(articleComments)
}
