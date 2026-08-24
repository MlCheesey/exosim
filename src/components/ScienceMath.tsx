type ScienceMathProps = {
  planetRadius: number;
  starRadius: number;
  orbitalInclination: number;
  radiusRatio: number;
  maximumTransitDepthPercent: number;
  effectiveTransitDepthPercent: number;
  transitGeometry: string;
};

export default function ScienceMath({
  planetRadius,
  starRadius,
  orbitalInclination,
  radiusRatio,
  maximumTransitDepthPercent,
  effectiveTransitDepthPercent,
  transitGeometry,
}: ScienceMathProps) {
  const calculationRows = [
    ["Planet radius", `${planetRadius.toFixed(1)} R⊕`],
    ["Star radius", `${starRadius.toFixed(1)} R☉`],
    ["Radius ratio", radiusRatio.toFixed(5)],
    [
      "Maximum depth",
      `${maximumTransitDepthPercent.toFixed(4)}%`,
    ],
    [
      "Orbit inclination",
      `${orbitalInclination.toFixed(0)}°`,
    ],
  ];

  const geometryNotes = [
    {
      index: "A",
      title: "Edge-on orbit",
      accent: "bg-amber-300",
      description:
        "Near 90°, the planet crosses the stellar disk and produces the strongest transit signal.",
    },
    {
      index: "B",
      title: "Grazing orbit",
      accent: "bg-rose-300",
      description:
        "The planet covers only the edge of the star, creating a shallower brightness dip.",
    },
    {
      index: "C",
      title: "Missed transit",
      accent: "bg-stone-600",
      description:
        "At lower inclinations, the planet passes above or below the star and no transit is detected.",
    },
  ];

  return (
    <section
      id="science"
      className="mx-auto w-full max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex min-w-0 items-start gap-4">
          <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-amber-300/70">
            05
          </span>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-stone-600">
              Signal model
            </p>

            <h2 className="mt-1 font-display text-xl font-medium tracking-[-0.025em] text-stone-50 sm:text-2xl">
              The science behind the transit
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-stone-500 sm:text-sm sm:leading-6">
              A planet blocks part of the star&apos;s visible surface.
              The lost light depends mainly on the planet&apos;s radius
              compared with its host star.
            </p>
          </div>
        </div>

        <div className="border-l border-rose-300/50 pl-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-stone-600">
            Current geometry
          </p>
          <p className="mt-1 font-mono text-xs text-rose-300">
            {transitGeometry}
          </p>
        </div>
      </div>

      <div className="mt-8 grid border-y border-white/[0.08] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="py-8 pr-0 lg:border-r lg:border-white/[0.08] lg:pr-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
            Transit-depth equation
          </p>

          <div className="my-8 border-l border-amber-300/55 py-3 pl-5 sm:pl-7">
            <p className="font-mono text-3xl tracking-[-0.04em] text-stone-100 sm:text-5xl">
              ΔF / F = (Rₚ / R★)²
            </p>
          </div>

          <div className="grid gap-5 text-sm leading-6 text-stone-500 sm:grid-cols-2">
            <p>
              <span className="font-mono text-amber-200">
                ΔF / F
              </span>{" "}
              is the fraction of starlight lost during transit.
            </p>

            <p>
              <span className="font-mono text-amber-200">
                Rₚ
              </span>{" "}
              is the planet radius and{" "}
              <span className="font-mono text-amber-200">
                R★
              </span>{" "}
              is the stellar radius.
            </p>

            <p className="sm:col-span-2">
              The ratio is squared because blocked light depends on
              circular area—not only the apparent width of the planet.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.08] py-8 lg:border-t-0 lg:pl-10">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
              Live calculation
            </p>
            <span className="size-1.5 animate-pulse rounded-full bg-rose-300" />
          </div>

          <dl className="mt-5 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {calculationRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-5 py-3"
              >
                <dt className="text-xs text-stone-600">
                  {label}
                </dt>
                <dd
                  className={`font-mono text-xs ${
                    label === "Maximum depth"
                      ? "text-rose-300"
                      : label === "Planet radius"
                        ? "text-amber-200"
                        : "text-stone-300"
                  }`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-l border-rose-300/55 pl-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-stone-600">
              Observable signal
            </p>
            <p className="mt-1 font-mono text-3xl text-rose-300">
              {effectiveTransitDepthPercent.toFixed(4)}%
            </p>
            <p className="mt-2 text-xs leading-5 text-stone-600">
              Inclination determines whether the planet fully crosses,
              grazes, or misses the visible stellar surface.
            </p>
          </div>
        </div>
      </div>

      <div className="grid border-b border-white/[0.08] md:grid-cols-3">
        {geometryNotes.map((note, index) => (
          <div
            key={note.title}
            className={`py-7 md:px-7 ${
              index > 0
                ? "border-t border-white/[0.08] md:border-l md:border-t-0"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`size-1.5 rounded-full ${note.accent}`} />
              <span className="font-mono text-[8px] tracking-[0.2em] text-stone-700">
                {note.index}
              </span>
            </div>
            <h3 className="mt-4 font-display text-base font-medium text-stone-200">
              {note.title}
            </h3>
            <p className="mt-2 text-xs leading-5 text-stone-600">
              {note.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}