import { createAuthClient } from 'better-auth/react'

// The browser-side half of the login system.
// No address is given on purpose: it talks to /api/auth on the same address the page
// came from. In development Vite forwards that to our Express server; in production
// Vercel forwards it to Render. Either way the login cookie stays first-party.
export const authClient = createAuthClient()
