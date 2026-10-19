import useFetch from '../hooks/useFetch'
import ApiStatus from './ApiStatus'

export default function Programs() {
  const { data: programs, loading, error, slow, retry } = useFetch('/api/programs')

  return (
    <section id="programs" className="px-[5vw] py-14 sm:py-20">
      <h2>Pick a program</h2>
      <p className="mb-10">Three ways to train. Switch any time.</p>

      <ApiStatus loading={loading} error={error} slow={slow} retry={retry} what="programs" />

      {programs && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {programs.map((p) => (
            <article
              key={p.id}
              className={`border-l-[6px] bg-white p-8 ${
                p.isFeatured ? 'border-l-brand' : 'border-l-navy'
              }`}
            >
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p className="mb-0 font-medium text-navy">
                {p.sessionMinutes} min, {p.daysPerWeek} days a week
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
