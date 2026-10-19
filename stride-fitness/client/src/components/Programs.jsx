const programs = [
  {
    title: 'Strength',
    text: 'Learn the basic lifts with coached sets, then add weight as you get stronger.',
    meta: '45 min, 4 days a week',
  },
  {
    title: 'Cardio',
    text: 'Intervals on bikes, rowers, and the track that build stamina without wrecking your week.',
    meta: '30 min, 3 days a week',
    featured: true,
  },
  {
    title: 'Mobility',
    text: 'Slow, guided sessions that loosen tight hips and shoulders and help you recover.',
    meta: '30 min, 2 days a week',
  },
]

export default function Programs() {
  return (
    <section id="programs" className="px-[5vw] py-14 sm:py-20">
      <h2>Pick a program</h2>
      <p className="mb-10">Three ways to train. Switch any time.</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {programs.map((p) => (
          <article
            key={p.title}
            className={`border-l-[6px] bg-white p-8 ${
              p.featured ? 'border-l-brand' : 'border-l-navy'
            }`}
          >
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <p className="mb-0 font-medium text-navy">{p.meta}</p>
          </article>
        ))}
      </div>
    </section>
  )
}