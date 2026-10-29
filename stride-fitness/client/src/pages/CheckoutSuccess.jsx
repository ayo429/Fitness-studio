import { useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { authClient } from '../lib/auth-client'

const card = 'max-w-xl rounded-[20px] border-2 border-tint bg-white px-8 py-9'
const MAX_TRIES = 10 // ask up to 10 times...
const WAIT_MS = 1500 // ...waiting 1.5 seconds between asks

const money = (cents) => `$${(cents / 100).toFixed(2)}`

// Stripe sends the browser back here the moment the payment is done, but the webhook
// (the message that actually marks the order paid) can arrive a moment later.
// So we ask the server about the order, and ask again if it is still pending.
function OrderStatus({ orderId }) {
  const [order, setOrder] = useState(null)
  const [state, setState] = useState('checking') // checking | paid | slow | expired | error

  useEffect(() => {
    let cancelled = false
    let timer

    async function check(attempt) {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (cancelled) return
        if (!res.ok) {
          setState('error')
          return
        }

        const { order } = await res.json()
        if (cancelled) return
        setOrder(order)

        if (order.status === 'paid') return setState('paid')
        if (order.status === 'expired') return setState('expired')
        if (attempt >= MAX_TRIES) return setState('slow')

        timer = setTimeout(() => check(attempt + 1), WAIT_MS)
      } catch {
        if (!cancelled) setState('error')
      }
    }

    check(1)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [orderId])

  if (state === 'checking') {
    return (
      <article className={card} aria-live="polite">
        <h2>Confirming your payment…</h2>
        <p className="mb-0">This usually takes a few seconds. Please keep this page open.</p>
      </article>
    )
  }

  if (state === 'paid') {
    return (
      <article className={card} aria-live="polite">
        <h2>Payment received</h2>
        <p>Thank you. Your membership is now active.</p>

        <dl className="m-0 mb-6">
          <dt className="font-semibold">Order number</dt>
          <dd className="m-0 mb-3">#{order.id}</dd>
          {order.items.map((item, i) => (
            <div key={i}>
              <dt className="font-semibold">Plan</dt>
              <dd className="m-0 mb-3">
                {item.planName} ({money(item.unitPriceCents)} × {item.quantity})
              </dd>
            </div>
          ))}
          <dt className="font-semibold">Total paid</dt>
          <dd className="m-0 mb-3">{money(order.totalCents)}</dd>
          <dt className="font-semibold">Paid on</dt>
          <dd className="m-0">{new Date(order.paidAt).toLocaleString()}</dd>
        </dl>

        <Link to="/dashboard" className="btn inline-block text-center">
          Go to my dashboard
        </Link>
      </article>
    )
  }

  if (state === 'slow') {
    return (
      <article className={card} aria-live="polite">
        <h2>Still confirming your payment</h2>
        <p>
          Order #{order?.id} has not been confirmed yet. This can take a little longer. Check your dashboard in a
          minute, or reload this page.
        </p>
        <Link to="/dashboard" className="btn inline-block text-center">
          Go to my dashboard
        </Link>
      </article>
    )
  }

  if (state === 'expired') {
    return (
      <article className={card}>
        <h2>Checkout was not completed</h2>
        <p>No payment was taken for this order. You can pick a plan and try again.</p>
        <Link to="/#plans" className="btn inline-block text-center">
          Back to plans
        </Link>
      </article>
    )
  }

  return (
    <article className={card}>
      <h2>We could not find that order</h2>
      <p>Check that you are signed in with the same account you paid with.</p>
      <Link to="/" className="btn inline-block text-center">
        Back to home
      </Link>
    </article>
  )
}

export default function CheckoutSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('order')

  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <main className="px-[5vw] py-14 sm:py-20">
        <p>Loading…</p>
      </main>
    )
  }

  // No order number in the address, or nobody is signed in: back to the home page
  if (!orderId || !session) return <Navigate to="/" replace />

  return (
    <main className="px-[5vw] py-14 sm:py-20">
      <OrderStatus orderId={orderId} />
    </main>
  )
}
