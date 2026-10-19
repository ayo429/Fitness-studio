import useFetch from '../hooks/useFetch'
import ApiStatus from './ApiStatus'

export default function Plans() {
  const { data: plans, loading, error, slow, retry } = useFetch('/api/plans')

  return (
    <section id="plans" className="px-[5vw] py-14 sm:py-20">
      <h2>Choose your plan</h2>
      <p className="mb-10">Every plan includes a free first week. Cancel any time.</p>

      <ApiStatus loading={loading} error={error} slow={slow} retry={retry} what="plans" />

      {plans && (
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-stretch gap-6">
          {plans.map((plan) => {
            const f = plan.isFeatured
            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-[20px] border-2 px-8 py-9 transition duration-200 motion-safe:hover:-translate-y-1.5 hover:shadow-[0_14px_30px_rgba(14,42,71,0.15)] ${
                  f ? 'border-brand bg-navy' : 'border-tint bg-white'
                }`}
              >
                {f && (
                  <p className="absolute -top-3.5 left-1/2 mb-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-4 py-1 text-[0.85rem] font-medium text-navy">
                    Most popular
                  </p>
                )}

                <h3 className={f ? 'text-white' : ''}>{plan.name}</h3>
                <p className={`mb-5 font-heading text-5xl leading-none font-bold ${f ? 'text-white' : 'text-navy'}`}>
                  ${plan.priceMonthly}
                  <span className="font-body text-base font-normal text-brand">/month</span>
                </p>

                <ul className="m-0 mb-8 grow list-none p-0">
                  {plan.features.map((item) => (
                    <li
                      key={item}
                      className={`relative border-t py-2 pl-7 before:absolute before:left-0 before:font-bold before:content-['✓'] ${
                        f
                          ? 'border-t-white/20 text-white before:text-brand'
                          : 'border-t-tint before:text-brand-dark'
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="#join"
                  className={`btn text-center transition duration-200 motion-safe:hover:-translate-y-[3px] motion-safe:hover:scale-[1.04] ${
                    f ? '' : 'btn-outline'
                  }`}
                >
                  Choose {plan.name}
                </a>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
