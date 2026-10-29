import { Router } from 'express'
import { pool, query } from '../db.js'
import { stripe } from '../stripe.js'
import { requireUser } from '../middleware/requireUser.js'

const router = Router()

// POST /api/checkout with { "planId": 2 }
// Signed-in members only. Returns { url }, the Stripe page the browser should go to.
router.post('/', requireUser, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payments are not set up yet' })

  const { planId } = req.body ?? {}
  if (!Number.isInteger(planId)) {
    return res.status(400).json({ error: 'planId must be a whole number' })
  }

  // The price comes from OUR database, never from the browser.
  const { rows } = await query(
    'SELECT id, name, price_monthly FROM plans WHERE id = $1',
    [planId]
  )
  const plan = rows[0]
  if (!plan) return res.status(404).json({ error: 'That plan does not exist' })

  // Plans store whole dollars; Stripe and our orders use cents.
  const unitPriceCents = plan.price_monthly * 100

  // Save the order and its item together, or not at all (a transaction).
  const client = await pool.connect()
  let orderId
  try {
    await client.query('BEGIN')
    const order = await client.query(
      'INSERT INTO orders (user_id, total_cents) VALUES ($1, $2) RETURNING id',
      [req.user.id, unitPriceCents]
    )
    orderId = order.rows[0].id
    await client.query(
      `INSERT INTO order_items (order_id, plan_id, plan_name, unit_price_cents)
       VALUES ($1, $2, $3, $4)`,
      [orderId, plan.id, plan.name, unitPriceCents]
    )
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }

  // Ask Stripe for a hosted checkout page. We attach our order id so the webhook
  // can find the right order when the payment completes.
  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${plan.name} membership (first month)` },
            unit_amount: unitPriceCents,
          },
          quantity: 1,
        },
      ],
      client_reference_id: String(orderId),
      metadata: { order_id: String(orderId) },
      success_url: `${process.env.CLIENT_URL}/checkout/success?order=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/#plans`,
    })
  } catch (err) {
    // Stripe refused, so this order can never be paid
    await query("UPDATE orders SET status = 'expired' WHERE id = $1", [orderId])
    throw err
  }

  await query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, orderId])

  res.json({ url: session.url })
})

export default router
