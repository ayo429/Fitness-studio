import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { authClient } from '../lib/auth-client'

// How long a signed-in member can sit untouched before being signed out.
// 20 seconds is short on purpose, so the feature is easy to show in a presentation.
// For everyday use, something like 60 * 30 (30 minutes) would be more normal.
const IDLE_LOGOUT_SECONDS = 20

// Anything that shows a person is still there
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']

// This component shows nothing. It just runs a countdown while someone is signed in.
// Every sign of activity restarts the countdown. If it ever reaches zero, we sign the
// member out for real (the server deletes their session) and tell them why.
export default function IdleLogout() {
  const { data: session } = authClient.useSession()
  const signedIn = Boolean(session?.user)

  useEffect(() => {
    if (!signedIn) return

    let timer
    const restart = () => {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        await authClient.signOut()
        toast.info('You were signed out because you were inactive.')
      }, IDLE_LOGOUT_SECONDS * 1000)
    }

    restart()
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, restart, { passive: true }))

    // When the member signs out (or the page closes), stop the countdown and the listeners
    return () => {
      clearTimeout(timer)
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, restart))
    }
  }, [signedIn])

  return null
}
