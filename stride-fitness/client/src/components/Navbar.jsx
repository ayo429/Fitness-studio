import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { authClient } from '../lib/auth-client'
import { useAuthDialog } from '../context/AuthDialog'

// "/#plans" means "the home page, scrolled to the Plans section".
// It works from the dashboard too, because it always goes through the home page.
const links = [
  { to: '/#programs', label: 'Programs' },
  { to: '/#plans', label: 'Plans' },
  { to: '/#how-it-works', label: 'How it works' },
]

const bar =
  'block h-0.5 w-6 rounded bg-snow transition duration-200 motion-reduce:transition-none'

const textButton =
  'cursor-pointer border-0 bg-transparent p-0 text-snow hover:underline'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Who is logged in? The hook asks the server once, then keeps the answer up to date.
  // "isPending" is true until the first answer arrives.
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  // The sign-in pop-up now lives at the top of the app; we just ask it to open
  const { openAuth } = useAuthDialog()
  const handleSignIn = () => {
    close()
    openAuth()
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    close()
  }

  // Close with Escape while the menu is open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Reset when the screen grows to the desktop layout (lg = 1024px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && close()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="relative z-50 bg-navy">
      <div className="flex items-center justify-between gap-4 px-[5vw] py-4">
        <Link to="/" onClick={close} className="font-heading text-[2rem] font-bold text-snow no-underline">
          Stride <span className="text-brand">Fitness</span>
        </Link>

        {/* Desktop nav (large screens) */}
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="m-0 flex list-none items-center gap-6 p-0">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-snow no-underline hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Show nothing here until we know whether someone is logged in */}
            {!isPending && (
              <li className="flex items-center gap-6">
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-snow no-underline hover:underline">
                      Dashboard
                    </Link>
                    <button type="button" onClick={handleSignOut} className={textButton}>
                      Sign out
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={handleSignIn} className={textButton}>
                    Sign in
                  </button>
                )}
              </li>
            )}

            <li>
              <Link to="/#plans" className="btn btn-small">Join now</Link>
            </li>
          </ul>
        </nav>

        {/* Hamburger (medium and small screens) */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[5px] rounded border-0 bg-transparent lg:hidden"
        >
          <span className={`${bar} ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`${bar} ${open ? 'opacity-0' : ''}`} />
          <span className={`${bar} ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-t border-white/10 bg-navy px-[5vw] pb-6 shadow-[0_14px_30px_rgba(14,42,71,0.35)] lg:hidden"
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {links.map((link) => (
              <li key={link.to} className="border-b border-white/10">
                <Link to={link.to} onClick={close} className="block py-4 text-snow no-underline">
                  {link.label}
                </Link>
              </li>
            ))}

            {!isPending && (
              <>
                {user ? (
                  <>
                    <li className="border-b border-white/10">
                      <p className="m-0 pt-4 text-snow">Hi, {user.name}</p>
                      <Link to="/dashboard" onClick={close} className="block py-4 text-snow no-underline">
                        Dashboard
                      </Link>
                    </li>
                    <li className="border-b border-white/10">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="block w-full cursor-pointer border-0 bg-transparent py-4 text-left text-snow"
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="border-b border-white/10">
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className="block w-full cursor-pointer border-0 bg-transparent py-4 text-left text-snow"
                    >
                      Sign in
                    </button>
                  </li>
                )}
              </>
            )}

            {/* <li className="pt-5">
              <Link to="/#join" onClick={close} className="btn block text-center">
                Join now
              </Link>
            </li> */}
          </ul>
        </nav>
      )}
    </header>
  )
}