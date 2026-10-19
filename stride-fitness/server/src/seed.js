import { pool } from './db.js'

const programs = [
  { name: 'Strength', description: 'Learn the basic lifts with coached sets, then add weight as you get stronger.', minutes: 45, days: 4, featured: false },
  { name: 'Cardio', description: 'Intervals on bikes, rowers, and the track that build stamina without wrecking your week.', minutes: 30, days: 3, featured: true },
  { name: 'Mobility', description: 'Slow, guided sessions that loosen tight hips and shoulders and help you recover.', minutes: 30, days: 2, featured: false },
]

const plans = [
  {
    name: 'Regular', price: 29, featured: false,
    features: ['Gym access, 6 am to 4 pm', 'Weights and cardio floor', 'Locker room access'],
  },
  {
    name: 'Premium', price: 59, featured: true,
    features: ['Gym access, all opening hours', 'All group classes included', 'Monthly progress check-in', 'Bring one guest per month'],
  },
  {
    name: 'Elite', price: 99, featured: false,
    features: ['24/7 gym access', 'All classes and private studio', 'Two personal training sessions a month', 'Sauna and recovery lounge'],
  },
]

const client = await pool.connect()
try {
  await client.query('BEGIN')

  for (const [i, p] of programs.entries()) {
    await client.query(
      `INSERT INTO programs (name, description, session_minutes, days_per_week, is_featured, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (name) DO UPDATE SET
         description = EXCLUDED.description,
         session_minutes = EXCLUDED.session_minutes,
         days_per_week = EXCLUDED.days_per_week,
         is_featured = EXCLUDED.is_featured,
         sort_order = EXCLUDED.sort_order`,
      [p.name, p.description, p.minutes, p.days, p.featured, i]
    )
  }

  for (const [i, plan] of plans.entries()) {
    const { rows } = await client.query(
      `INSERT INTO plans (name, price_monthly, is_featured, sort_order)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (name) DO UPDATE SET
         price_monthly = EXCLUDED.price_monthly,
         is_featured = EXCLUDED.is_featured,
         sort_order = EXCLUDED.sort_order
       RETURNING id`,
      [plan.name, plan.price, plan.featured, i]
    )
    const planId = rows[0].id

    // Replace this plan's features with the current list
    await client.query('DELETE FROM plan_features WHERE plan_id = $1', [planId])
    for (const [j, text] of plan.features.entries()) {
      await client.query(
        'INSERT INTO plan_features (plan_id, text, sort_order) VALUES ($1, $2, $3)',
        [planId, text, j]
      )
    }
  }

  await client.query('COMMIT')

  const count = async (table) =>
    (await client.query(`SELECT count(*)::int AS n FROM ${table}`)).rows[0].n
  console.log(
    `Seeded: ${await count('programs')} programs, ${await count('plans')} plans, ${await count('plan_features')} features`
  )
} catch (err) {
  await client.query('ROLLBACK')
  console.error('Seed failed, rolled back:', err.message)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
