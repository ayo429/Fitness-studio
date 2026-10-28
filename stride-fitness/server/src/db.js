import 'dotenv/config'
import pg from 'pg'

// A pool keeps a few database connections open and reuses them,
// instead of opening a new one for every request.
//
// Normally the pool talks to Postgres on port 5432. Some networks block that port.
// For local development only, putting DB_OVER_WEBSOCKET=true in server/.env sends the
// same queries over a WebSocket on the normal web port (443) instead.
// Render does not set that variable, so the live site keeps the plain connection.
let pool

if (process.env.DB_OVER_WEBSOCKET === 'true') {
  const { Pool: NeonPool, neonConfig } = await import('@neondatabase/serverless')
  neonConfig.webSocketConstructor = WebSocket // built into Node 22 and newer
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL })
  pool.on('error', (err) => console.error('Database pool error:', err.message))
  console.log('Database: using the WebSocket connection (local only)')
} else {
  const { Pool } = pg
  pool = new Pool({ connectionString: process.env.DATABASE_URL })
}

export { pool }

export const query = (text, params) => pool.query(text, params)