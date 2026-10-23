import { Router } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../auth.js'
import { query } from '../db.js'

const router = Router()

// Guard: only signed-in members get past this point.
// It asks Better Auth who the cookie belongs to; no session means a 401 ("not signed in").
async function requireUser(req, res, next) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  if (!session) return res.status(401).json({ error: 'Please sign in first' })
  req.user = session.user
  next()
}

// Looks up a member's current plan, or returns null if they have not chosen one yet
async function findMembership(userId) {
  const { rows } = await query(
    `SELECT p.id            AS "planId",
            p.name          AS "planName",
            p.price_monthly AS "priceMonthly",
            m.chosen_at     AS "chosenAt"
     FROM memberships m
     JOIN plans p ON p.id = m.plan_id
     WHERE m.user_id = $1`,
    [userId]
  )
  return rows[0] ?? null
}

// GET /api/membership -> the signed-in member's current plan
router.get('/', requireUser, async (req, res) => {
  res.json({ membership: await findMembership(req.user.id) })
})

// PUT /api/membership with { "planId": 2 } -> choose (or change) the member's plan
router.put('/', requireUser, async (req, res) => {
  const { planId } = req.body ?? {}
  if (!Number.isInteger(planId)) {
    return res.status(400).json({ error: 'planId must be a whole number' })
  }

  const plan = await query('SELECT id FROM plans WHERE id = $1', [planId])
  if (plan.rowCount === 0) {
    return res.status(404).json({ error: 'That plan does not exist' })
  }

  // First choice adds a row; choosing again updates the same row (one plan per member)
  await query(
    `INSERT INTO memberships (user_id, plan_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id)
     DO UPDATE SET plan_id = EXCLUDED.plan_id, chosen_at = now()`,
    [req.user.id, planId]
  )

  res.json({ membership: await findMembership(req.user.id) })
})

export default router
