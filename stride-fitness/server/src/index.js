import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import programsRouter from './routes/programs.js'
import plansRouter from './routes/plans.js'

const app = express()
const PORT = process.env.PORT || 4000

// Only our frontend may call this API, and it may send cookies (needed for login)
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

// Note: when we add auth, its handler must be mounted BEFORE this line
app.use(express.json())

app.get('/', (req, res) => res.json({ name: 'Stride Fitness API' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/programs', programsRouter)
app.use('/api/plans', plansRouter)

// Any error passed to next(err) ends up here: log it, send a safe message
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
