import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
console.log('VITE_NEON_DATABASE_URL', import.meta.env.VITE_NEON_DATABASE_URL)
export const sql = neon(import.meta.env.VITE_NEON_DATABASE_URL)
export const db = drizzle(sql)
