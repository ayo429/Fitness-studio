import 'dotenv/config'
import { betterAuth } from 'better-auth'
import { pool } from './db.js'

// This is the login system. Better Auth reads two secrets from the environment by itself:
//   BETTER_AUTH_SECRET  - used to sign the login cookie so it can't be forged
//   BETTER_AUTH_URL     - the public address of the app (the Vercel address in production)
export const auth = betterAuth({
  // Reuse our existing database pool so users and sessions live in the same Neon database
  database: pool,

  // Let people sign up and sign in with an email and a password
  emailAndPassword: { enabled: true },

  // Only requests coming from our own frontend are accepted
  trustedOrigins: [process.env.CLIENT_URL].filter(Boolean),
})
