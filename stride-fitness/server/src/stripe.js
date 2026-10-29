import 'dotenv/config'
import Stripe from 'stripe'

// One Stripe client for the whole server. The secret key comes from .env (locally)
// or from Render's settings (live); it is never written in the code.
const key = process.env.STRIPE_SECRET_KEY

if (!key) console.warn('STRIPE_SECRET_KEY is not set, so checkout is switched off')

export const stripe = key ? new Stripe(key) : null
