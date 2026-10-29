import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../auth.js'

// A middleware is a function that runs before a route. This one is the login check:
// it asks Better Auth who the cookie belongs to. No valid session means a 401
// ("not signed in") and the route behind it never runs. Otherwise it puts the user
// on req.user so the route knows exactly who is asking.
export async function requireUser(req, res, next) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  if (!session) return res.status(401).json({ error: 'Please sign in first' })

  req.user = session.user
  next()
}
