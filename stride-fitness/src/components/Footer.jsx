const exploreLinks = [
  { href: '#programs', label: 'Programs' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#plans', label: 'Plans' },
  { href: '#join', label: 'Start free week' },
]

const headingClass =
  'mb-4 font-heading text-sm font-bold tracking-widest text-snow uppercase'
const linkClass =
  'text-tint no-underline opacity-80 transition-opacity hover:opacity-100 hover:underline'

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault()
    // TODO: send e.target.email.value to your email service
  }

  return (
    <footer className="bg-navy px-[5vw] pt-14 pb-8 text-[0.95rem] text-tint">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.6fr] lg:gap-12">
        {/* Brand */}
        <div>
          <a href="#top" className="font-heading text-3xl font-bold text-snow no-underline">
            Stride <span className="text-brand">Fitness</span>
          </a>
          <p className="mt-3 mb-0 max-w-[32ch] opacity-80">
            Strength, cardio, and mobility classes for every level.
          </p>
        </div>

        {/* Explore */}
        <nav aria-label="Footer navigation">
          <h3 className={headingClass}>Explore</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkClass}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className={headingClass}>Contact</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li className="flex items-center gap-2.5">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-brand stroke-2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <a href="mailto:hello@stridefitness.com" className={linkClass}>
                hello@stridefitness.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-brand stroke-2">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span className="opacity-80">Lagos, Nigeria</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className={headingClass}>Get weekly fitness tips</h3>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              aria-label="Your email"
              required
              className="min-w-0 flex-1 rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-tint outline-none transition-colors placeholder:text-white/40 focus:border-white/60"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-md border-0 bg-brand px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-85"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-[0.85rem] sm:flex-row sm:items-center sm:justify-between">
        <p className="mb-0 opacity-70">&copy; 2026 Stride Fitness. Practicum project, Week 1.</p>
        <div className="flex gap-5">
          <a href="#" className={linkClass}>Privacy Policy</a>
          <a href="#" className={linkClass}>Terms of Use</a>
        </div>
      </div>
    </footer>
  )
}