export default function Hero() {
  return (
    <section
      className="px-[5vw] pt-16 pb-20 sm:pt-24 sm:pb-28"
      style={{
        background:
          "linear-gradient(90deg, rgba(14,42,71,0.92), rgba(14,42,71,0.55)), url('/images/fitness_img.jpg') center / cover no-repeat",
      }}
    >
      <div className="max-w-[900px]">
        <h1 className="text-snow">Train at your pace. Get stronger anyway.</h1>
        <p className="mb-8 text-[1.35rem] text-tint">
          Strength, cardio, and mobility classes for every level, led by coaches who adjust the
          workout to you.
        </p>
        <a href="#join" className="btn">Start your free week</a>
      </div>
    </section>
  )
}