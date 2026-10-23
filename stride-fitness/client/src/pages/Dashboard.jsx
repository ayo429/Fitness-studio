import { Link, Navigate } from 'react-router-dom'
import { authClient } from '../lib/auth-client'
import useFetch from '../hooks/useFetch'
import ApiStatus from '../components/ApiStatus'

const card = 'rounded-[20px] border-2 border-tint bg-white px-8 py-9'

// Shows the member's current plan. It only runs for signed-in members,
// so the /api/membership request is never made for visitors.
function PlanCard() {
  const { data, loading, error, slow, retry } = useFetch('/api/membership')
  const membership = data?.membership

  return (
    <article className={card}>
      <h3>Your plan</h3>

      <ApiStatus loading={loading} error={error} slow={slow} retry={retry} what="your plan" />

      {data && membership && (
        <>
          <p className="mb-1 mt-4 font-heading text-2xl font-bold text-navy">{membership.planName}</p>
          <p className="mb-2 font-heading text-5xl leading-none font-bold text-navy">
            ${membership.priceMonthly}
            <span className="font-body text-base font-normal text-brand">/month</span>
          </p>
          <p className="mb-6">
            Chosen on {new Date(membership.chosenAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
          <Link to="/#plans" className="btn btn-outline inline-block text-center">
            Change plan
          </Link>
        </>
      )}

      {data && !membership && (
        <>
          <p className="mt-4">You have not chosen a plan yet. Pick one to start your free first week.</p>
          <Link to="/#plans" className="btn inline-block text-center">
            Choose a plan
          </Link>
        </>
      )}
    </article>
  )
}

export default function Dashboard() {
  // Ask the login system who is here
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <main className="px-[5vw] py-14 sm:py-20">
        <p>Loading your account…</p>
      </main>
    )
  }

  // Not signed in (or just signed out): send them back to the home page
  if (!session) return <Navigate to="/" replace />

  const { user } = session

  return (
    <main className="px-[5vw] py-14 sm:py-20">
      <h2>Welcome back, {user.name}</h2>
      <p className="mb-10">Here is your Stride membership at a glance.</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-6">
        <PlanCard />

        <article className={card}>
          <h3>Your account</h3>
          <dl className="m-0 mt-4">
            <dt className="font-semibold">Name</dt>
            <dd className="m-0 mb-3">{user.name}</dd>
            <dt className="font-semibold">Email</dt>
            <dd className="m-0 break-words">{user.email}</dd>
          </dl>
        </article>
      </div>
    </main>
  )
}