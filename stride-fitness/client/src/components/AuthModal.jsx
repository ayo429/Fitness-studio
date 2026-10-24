import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { authClient } from '../lib/auth-client'

const field =
  'w-full rounded border border-navy/30 bg-white px-3 py-2 text-navy focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-navy'

export default function AuthModal({ open, onClose }) {
  const dialogRef = useRef(null)
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  // After a successful signup this holds the new member's name and shows the welcome screen
  const [welcomeName, setWelcomeName] = useState('')

  const isSignUp = mode === 'signup'

  // The browser's built-in <dialog> handles focus trapping and the Escape key for us.
  // We just open or close it when the "open" prop changes.
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Whenever the dialog closes (button, Escape or link), clear it so the next
  // visitor starts with a fresh sign-in form.
  const handleClose = () => {
    setWelcomeName('')
    setMode('signin')
    setName('')
    setEmail('')
    setPassword('')
    setError('')
    onClose()
  }

  const switchMode = () => {
    setMode(isSignUp ? 'signin' : 'signup')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      // Both calls resolve to { data, error } instead of throwing for normal failures
      const result = isSignUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password, callbackURL: '/dashboard' })

      if (result.error) {
        setError(result.error.message || 'Something went wrong. Please try again.')
        return
      }
      setPassword('')

      if (isSignUp) {
        // Stay open and show the welcome screen
        setWelcomeName(result.data?.user?.name || name)
      } else {
        handleClose()
      }
    } catch {
      setError('Could not reach the server. Wait a few seconds and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="auth-title"
      className="m-auto w-[min(92vw,26rem)] rounded-lg bg-white p-6 text-navy backdrop:bg-black/50"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="auth-title" className="m-0 font-heading text-2xl font-bold">
          {welcomeName
            ? `Welcome to Stride, ${welcomeName}`
            : isSignUp
              ? 'Create your account'
              : 'Sign in'}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent text-2xl leading-none text-navy hover:bg-navy/10"
        >
          &times;
        </button>
      </div>

      {welcomeName ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="m-0">Your account is ready and you are signed in. Head to your dashboard to pick a plan and get started.</p>
          <Link to="/dashboard" onClick={handleClose} className="btn text-center">
            Go to my dashboard
          </Link>
          <Link to="/#plans" onClick={handleClose} className="text-center font-semibold text-navy underline">
            Browse plans first
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {isSignUp && (
              <label className="flex flex-col gap-1">
                Name
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={field}
                />
              </label>
            )}

            <label className="flex flex-col gap-1">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
              />
            </label>

            <label className="flex flex-col gap-1">
              Password
              <input
                type="password"
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
              />
              {isSignUp && <span className="text-sm opacity-75">At least 8 characters.</span>}
            </label>

            {error && (
              <p role="alert" className="m-0 rounded border border-red-300 bg-red-50 px-3 py-2 text-red-800">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn cursor-pointer disabled:opacity-60">
              {busy ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="mb-0 mt-4 text-center">
            {isSignUp ? 'Already have an account?' : 'New to Stride?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-navy underline"
            >
              {isSignUp ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </>
      )}
    </dialog>
  )
}