const navLinks = [
  { href: '#top', label: 'Back to top' },
  { href: '#programs', label: 'Programs' },
  { href: '#plans', label: 'Plans' },
  { href: '#how-it-works', label: 'How it works' },
]

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault()
  }

  return (
    <footer className="bg-navy px-[5vw] py-8 text-[0.95rem] text-tint">
      <div className="flex flex-wrap items-start justify-between gap-8">
        {/* Legal */}
        <div>
          <p className="mb-2 opacity-80">&copy; 2026 Stride Fitness. Practicum project, Week 1.</p>
          <div className="mt-2 flex gap-4">
            <a href="#" className="text-[0.85rem] text-tint no-underline opacity-70 transition-opacity hover:opacity-100">
              Privacy Policy
            </a>
            <a href="#" className="text-[0.85rem] text-tint no-underline opacity-70 transition-opacity hover:opacity-100">
              Terms of Use
            </a>
          </div>
        </div>

        {/* Nav links */}
        <ul className="m-0 list-none p-0">
          {navLinks.map((l) => (
            <li key={l.href} className="mb-2">
              <a href={l.href} className="text-tint no-underline opacity-80 transition-opacity hover:opacity-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Contact */}
        <div>
          <p className="mb-1.5 opacity-80">📧 hello@stridefitness.com</p>
          <p className="mb-1.5 opacity-80">📍 Lagos, Nigeria</p>
        </div>

        {/* Newsletter */}
        <div>
          <p className="mb-2.5 font-semibold">Get weekly fitness tips</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              aria-label="Your email"
              className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-tint outline-none transition-colors placeholder:text-white/40 focus:border-white/60"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-md border-0 bg-brand px-4 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-85"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}