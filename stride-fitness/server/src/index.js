import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node'
import { auth } from './auth.js'
import programsRouter from './routes/programs.js'
import plansRouter from './routes/plans.js'
import membershipRouter from './routes/membership.js'

const app = express()
const PORT = process.env.PORT || 4000

// On Render our server sits behind a proxy. This tells Express to trust it,
// so it knows the real connection was https and who the real visitor is.
app.set('trust proxy', 1)

// Only our frontend may call this API, and it may send cookies (needed for login)
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

// Login system: handles sign up, sign in, sign out and sessions under /api/auth/...
// It must come BEFORE express.json(), because it reads the request body itself.
// (*splat is the Express 5 way of writing "everything under /api/auth/")
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

app.get('/', (req, res) => res.json({ name: 'Stride Fitness API' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Who is logged in right now? Returns the session, or null if nobody is.
// Handy for testing that a login survives a page refresh.
app.get('/api/me', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  res.json(session)
})

app.use('/api/programs', programsRouter)
app.use('/api/plans', plansRouter)
app.use('/api/membership', membershipRouter)

// Any error passed to next(err) ends up here: log it, send a safe message
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
