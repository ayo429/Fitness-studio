import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// GET /api/plans -> membership plans, each with its list of features
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.id,
              p.name,
              p.price_monthly AS "priceMonthly",
              p.is_featured   AS "isFeatured",
              COALESCE(
                json_agg(f.text ORDER BY f.sort_order) FILTER (WHERE f.id IS NOT NULL),
                '[]'::json
              ) AS features
       FROM plans p
       LEFT JOIN plan_features f ON f.plan_id = p.id
       GROUP BY p.id
       ORDER BY p.sort_order`
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

export default router
