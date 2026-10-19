import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// GET /api/programs -> list of training programs
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id,
              name,
              description,
              session_minutes AS "sessionMinutes",
              days_per_week   AS "daysPerWeek",
              is_featured     AS "isFeatured"
       FROM programs
       ORDER BY sort_order`
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

export default router
