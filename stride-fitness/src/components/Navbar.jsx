import { useEffect, useState } from 'react'

const links = [
  { href: '#programs', label: 'Programs' },
  { href: '#plans', label: 'Plans' },
  { href: '#how-it-works', label: 'How it works' },
]

const bar =
  'block h-0.5 w-6 rounded bg-snow transition duration-200 motion-reduce:transition-none'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

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
        <a href="#top" onClick={close} className="font-heading text-[2rem] font-bold text-snow no-underline">
          Stride <span className="text-brand">Fitness</span>
        </a>

        {/* Desktop nav (large screens) */}
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="m-0 flex list-none items-center gap-6 p-0">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-snow no-underline hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#join" className="btn btn-small">Start free week</a>
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
              <li key={link.href} className="border-b border-white/10">
                <a href={link.href} onClick={close} className="block py-4 text-snow no-underline">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-5">
              <a href="#join" onClick={close} className="btn block text-center">
                Start free week
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}