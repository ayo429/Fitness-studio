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

  // Login timeout: a session lasts 30 minutes. Each time it is used, and more than
  // 5 minutes have passed since it was last extended, the 30 minutes start again.
  // So someone who stays away for about half an hour is signed out.
  session: {
    expiresIn: 20,
    updateAge: 5,
},
})
