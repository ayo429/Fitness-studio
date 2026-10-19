import { readFile } from 'node:fs/promises'
import { pool } from './db.js'

const sql = await readFile(new URL('../sql/schema.sql', import.meta.url), 'utf8')
await pool.query(sql)
console.log('Schema applied.')

const { rows } = await pool.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1"
)
console.log('Tables:', rows.map((r) => r.table_name).join(', '))
await pool.end()
