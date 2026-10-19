const steps = [
  {
    img: '/images/goal_img.jpg',
    alt: 'Person setting a fitness goal',
    title: 'Tell us your goal',
    text: 'Answer a few questions about your schedule and experience.',
  },
  {
    img: '/images/plan_img.jpg',
    alt: 'Weekly workout plan',
    title: 'Get your plan',
    text: 'A coach builds a weekly plan that fits your calendar.',
  },
  {
    img: '/images/train_img.jpg',
    alt: 'Person training in the gym',
    title: 'Show up and train',
    text: 'Join a class, follow your plan, and track your progress.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-tint px-[5vw] py-14 sm:py-20">
      <h2>How it works</h2>
      <ol className="m-0 mt-10 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 p-0">
        {steps.map((s) => (
          <li key={s.title} className="overflow-hidden rounded-[20px] bg-white">
            <img src={s.img} alt={s.alt} className="block aspect-[4/3] w-full object-cover" />
            <div className="p-6">
              <h3 className="text-center">{s.title}</h3>
              <p className="mb-0">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}