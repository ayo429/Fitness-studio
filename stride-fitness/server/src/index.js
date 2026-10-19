import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000

// Only our frontend may call this API, and it may send cookies (needed for login)
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

// Note: when we add auth, its handler must be mounted BEFORE this line
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
