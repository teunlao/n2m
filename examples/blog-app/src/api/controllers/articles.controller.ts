import { db } from '../db/client'
import { Context } from 'hono'
import { z } from 'zod'
import { articles, insertArticleSchema } from '../db/schema'

export const createArticle = async (c: Context) => {
  const body = await c.req.json()
  const parsedBody = insertArticleSchema.parse(body)

  const newArticle = await db.insert(articles).values(parsedBody).returning().get()
  return c.json(newArticle, { status: 201 })
}

export const getArticles = async (c: Context) => {
  const allArticles = await db.select().from(articles).all()
  return c.json(allArticles)
}
