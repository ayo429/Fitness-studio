import { pool } from './db.js'

const { rows } = await pool.query('SELECT now() AS time, current_database() AS db')
console.log('Connected:', rows[0])
await pool.end()
