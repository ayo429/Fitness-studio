import { pool, query } from '../db.js'
import { stripe } from '../stripe.js'

// Stripe calls this URL by itself when something happens to a payment.
// This is the ONLY place in the whole server that marks an order as paid.
export async function stripeWebhook(req, res) {
  if (!stripe) return res.status(503).send('Payments are not set up yet')

  // 1. Check the message really came from Stripe. The signature is made from the exact
  //    bytes Stripe sent, which is why this route reads the raw body (see index.js).
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature check failed:', err.message)
    return res.status(400).send('Invalid signature')
  }

  // 2. React to the events we care about
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.payment_status === 'paid') await markOrderPaid(session)
  }

  if (event.type === 'checkout.session.expired') {
    await query(
      "UPDATE orders SET status = 'expired' WHERE stripe_session_id = $1 AND status = 'pending'",
      [event.data.object.id]
    )
  }

  // 3. Tell Stripe we got it. Anything other than a 2xx makes Stripe try again later.
  res.json({ received: true })
}

async function markOrderPaid(session) {
  const orderId = Number(session.client_reference_id)
  if (!Number.isInteger(orderId)) return

  // Mark the order paid and give the member their plan, together or not at all.
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Only a pending order whose Stripe session and amount both match can become paid.
    // If Stripe sends the same event twice, the second time nothing matches and nothing changes.
    const { rows } = await client.query(
      `UPDATE orders
       SET status = 'paid', paid_at = now()
       WHERE id = $1 AND stripe_session_id = $2 AND total_cents = $3 AND status = 'pending'
       RETURNING id, user_id`,
      [orderId, session.id, session.amount_total]
    )

    if (rows.length > 0) {
      // The membership now starts, using the plan that was in the order
      await client.query(
        `INSERT INTO memberships (user_id, plan_id)
         SELECT $2::text, plan_id FROM order_items
         WHERE order_id = $1 AND plan_id IS NOT NULL
         LIMIT 1
         ON CONFLICT (user_id)
         DO UPDATE SET plan_id = EXCLUDED.plan_id, chosen_at = now()`,
        [orderId, rows[0].user_id]
      )
    }

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
