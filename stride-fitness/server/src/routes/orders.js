import { Router } from 'express'
import { query } from '../db.js'
import { requireUser } from '../middleware/requireUser.js'

const router = Router()

// GET /api/orders/12 -> one order with its items, so the success page can show the status.
// The query also checks the order belongs to the signed-in member, so nobody can look
// at someone else's order by guessing a number.
router.get('/:id', requireUser, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Order id must be a number' })

  const { rows } = await query(
    `SELECT o.id,
            o.status,
            o.total_cents AS "totalCents",
            o.currency,
            o.created_at  AS "createdAt",
            o.paid_at     AS "paidAt",
            COALESCE(
              json_agg(
                json_build_object(
                  'planName', i.plan_name,
                  'unitPriceCents', i.unit_price_cents,
                  'quantity', i.quantity
                )
              ) FILTER (WHERE i.id IS NOT NULL),
              '[]'::json
            ) AS items
     FROM orders o
     LEFT JOIN order_items i ON i.order_id = o.id
     WHERE o.id = $1 AND o.user_id = $2
     GROUP BY o.id`,
    [id, req.user.id]
  )

  if (rows.length === 0) return res.status(404).json({ error: 'Order not found' })
  res.json({ order: rows[0] })
})

export default router
