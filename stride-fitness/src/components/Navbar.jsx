const links = [
  { href: '#programs', label: 'Programs' },
  { href: '#plans', label: 'Plans' },
  { href: '#how-it-works', label: 'How it works' },
]

export default function Navbar() {
  return (
    <header className="flex flex-col items-center justify-between gap-4 bg-navy px-[5vw] py-4 sm:flex-row">
      <a href="#top" className="font-heading text-[2rem] font-bold text-snow no-underline">
        Stride <span className="text-brand">Fitness</span>
      </a>
      <nav aria-label="Main navigation">
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-4 p-0 sm:gap-6">
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
    </header>
  )
}