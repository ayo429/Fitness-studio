import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

// A pool keeps a few database connections open and reuses them,
// instead of opening a new one for every request.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const query = (text, params) => pool.query(text, params)
