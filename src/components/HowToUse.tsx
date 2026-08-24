const guideSteps = [
  {
    number: "01",
    title: "Choose a system",
    description:
      "Use the default system, adjust it manually, or load a confirmed planet from the NASA library.",
  },
  {
    number: "02",
    title: "Set the geometry",
    description:
      "Change the planet, star, inclination, and telescope noise from Mission Controls.",
  },
  {
    number: "03",
    title: "Observe the transit",
    description:
      "Watch the planet cross the star. Pause, reset, or change the orbital speed when needed.",
  },
  {
    number: "04",
    title: "Read the signal",
    description:
      "Compare the live brightness dip with the calculated transit depth and Science section.",
  },
];

export default function HowToUse() {
  return (
    <section
      aria-label="How to use ExoSim"
      className="mx-auto w-full max-w-[1500px] border-b border-white/[0.08] px-4 sm:px-6"
    >
      <details open className="group py-4 sm:py-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 marker:content-none">
          <div className="flex min-w-0 items-center gap-4">
            <span className="font-mono text-[8px] tracking-[0.2em] text-amber-300/70">
              00
            </span>

            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-stone-700">
                Quick guide
              </p>
              <h2 className="mt-0.5 font-display text-sm font-medium text-stone-300 sm:text-base">
                Run your first observation
              </h2>
            </div>
          </div>

          <span className="relative size-5 shrink-0 text-stone-600 transition group-hover:text-amber-200">
            <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current" />
            <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
          </span>
        </summary>

        <div className="mt-5 grid border-y border-white/[0.07] md:grid-cols-2 xl:grid-cols-4">
          {guideSteps.map((step, index) => (
            <div
              key={step.number}
              className={`py-5 md:px-5 xl:px-6 ${
                index > 0
                  ? "border-t border-white/[0.07] md:border-l md:border-t-0"
                  : ""
              } ${
                index === 2
                  ? "md:border-l-0 xl:border-l"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[8px] tracking-[0.2em] text-amber-300/70">
                  {step.number}
                </span>
                <span className="h-px w-5 bg-white/[0.1]" />
              </div>

              <h3 className="mt-3 font-display text-sm font-medium text-stone-300">
                {step.title}
              </h3>

              <p className="mt-1.5 text-[11px] leading-5 text-stone-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
