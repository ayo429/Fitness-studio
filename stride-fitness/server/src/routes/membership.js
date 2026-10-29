import { Router } from 'express'
import { query } from '../db.js'
import { requireUser } from '../middleware/requireUser.js'

const router = Router()

// GET /api/membership -> the signed-in member's current plan, or null if they have none.
// There is no way to set a plan here any more: a membership only starts when the
// Stripe webhook confirms a payment (see stripeWebhook.js).
router.get('/', requireUser, async (req, res) => {
  const { rows } = await query(
    `SELECT p.id            AS "planId",
            p.name          AS "planName",
            p.price_monthly AS "priceMonthly",
            m.chosen_at     AS "chosenAt"
     FROM memberships m
     JOIN plans p ON p.id = m.plan_id
     WHERE m.user_id = $1`,
    [req.user.id]
  )
  res.json({ membership: rows[0] ?? null })
})

export default router
