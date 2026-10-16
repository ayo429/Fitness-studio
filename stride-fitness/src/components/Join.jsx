export default function Join() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: send e.target.email.value to your backend / email service
  }

  return (
    <section id="join" className="px-[5vw] py-14 sm:py-20">
      <div className="mx-auto max-w-[640px]">
        <h2>Start your free week</h2>
        <p>No card needed. Enter your email and we'll send your first plan.</p>

        <form onSubmit={handleSubmit} className="flex max-w-[420px] flex-col gap-3">
          <label htmlFor="email" className="font-medium text-navy">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            className="rounded border-2 border-navy bg-white px-4 py-[0.8rem]"
          />
          <button type="submit" className="btn">Send my plan</button>
        </form>
      </div>
    </section>
  )
}