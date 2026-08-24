import {
  ArrowDownToLine,
  ExternalLink,
} from "lucide-react";

export type ExoplanetPreset = {
  name: string;
  planetType: string;
  planetRadius: number;
  starRadius: number;
  orbitalPeriod: number;
  discoveryYear: number;
  description: string;
  sourceUrl: string;
};

type ExoplanetLibraryProps = {
  activePlanetName?: string;
  onLoadPreset: (
    preset: ExoplanetPreset,
  ) => void;
};

const exoplanetPresets: ExoplanetPreset[] = [
  {
    name: "Kepler-10 b",
    planetType: "Super Earth",
    planetRadius: 1.47,
    starRadius: 1.06,
    orbitalPeriod: 0.84,
    discoveryYear: 2011,
    description:
      "A hot rocky world and one of the first confirmed terrestrial planets discovered by Kepler.",
    sourceUrl:
      "https://exoplanetarchive.ipac.caltech.edu/overview/Kepler-10",
  },
  {
    name: "Kepler-186 f",
    planetType: "Super Earth",
    planetRadius: 1.17,
    starRadius: 0.52,
    orbitalPeriod: 129.9,
    discoveryYear: 2014,
    description:
      "An Earth-sized world orbiting within the habitable zone of a cool red dwarf star.",
    sourceUrl:
      "https://exoplanetarchive.ipac.caltech.edu/overview/Kepler-186",
  },
  {
    name: "Kepler-20 e",
    planetType: "Terrestrial",
    planetRadius: 0.82,
    starRadius: 0.94,
    orbitalPeriod: 6.1,
    discoveryYear: 2011,
    description:
      "A small, intensely heated rocky planet orbiting close to its Sun-like host star.",
    sourceUrl:
      "https://exoplanetarchive.ipac.caltech.edu/overview/Kepler-20",
  },
];

export default function ExoplanetLibrary({
  activePlanetName,
  onLoadPreset,
}: ExoplanetLibraryProps) {
  return (
    <section
      id="library"
      className="mx-auto w-full max-w-[1500px] border-b border-white/[0.08] px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex min-w-0 items-start gap-4">
          <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-amber-300/70">
            04
          </span>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-stone-600">
              NASA archive
            </p>

            <h2 className="mt-1 font-display text-xl font-medium tracking-[-0.025em] text-stone-50 sm:text-2xl">
              Confirmed planetary systems
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-stone-500 sm:text-sm sm:leading-6">
              Load published planetary and stellar measurements into
              the simulator and compare the signals produced by
              different systems.
            </p>
          </div>
        </div>

        <a
          href="https://exoplanetarchive.ipac.caltech.edu/"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 border-b border-white/[0.1] pb-2 text-xs text-stone-500 transition hover:border-amber-300/50 hover:text-amber-200"
        >
          NASA Exoplanet Archive
          <ExternalLink
            size={13}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>

      <div className="mt-8 grid border-y border-white/[0.08] lg:grid-cols-3">
        {exoplanetPresets.map(
          (preset, index) => {
            const isActive =
              activePlanetName === preset.name;

            return (
              <article
                key={preset.name}
                className={`relative px-1 py-7 sm:px-5 lg:px-7 ${
                  index > 0
                    ? "border-t border-white/[0.08] lg:border-l lg:border-t-0"
                    : ""
                }`}
              >
                {isActive ? (
                  <span className="absolute inset-y-5 left-0 w-px bg-amber-300 shadow-[0_0_18px_rgba(245,181,76,0.4)]" />
                ) : null}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-stone-700">
                      Target {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-3 font-display text-xl font-medium tracking-[-0.025em] text-stone-100">
                      {preset.name}
                    </h3>

                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-rose-300">
                      {preset.planetType}
                    </p>
                  </div>

                  <span
                    className={`mt-1 size-2 rounded-full ${
                      isActive
                        ? "bg-amber-300 shadow-[0_0_14px_rgba(245,181,76,0.65)]"
                        : "border border-stone-700"
                    }`}
                  />
                </div>

                <dl className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                  {[
                    [
                      "Planet radius",
                      `${preset.planetRadius.toFixed(2)} R⊕`,
                    ],
                    [
                      "Star radius",
                      `${preset.starRadius.toFixed(2)} R☉`,
                    ],
                    [
                      "Orbital period",
                      `${preset.orbitalPeriod} days`,
                    ],
                    [
                      "Discovery",
                      String(preset.discoveryYear),
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <dt className="text-xs text-stone-600">
                        {label}
                      </dt>
                      <dd className="font-mono text-[11px] text-stone-300">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 min-h-16 text-xs leading-5 text-stone-500">
                  {preset.description}
                </p>

                <div className="mt-5 grid grid-cols-[1fr_42px] gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset(preset);
                    }}
                    className="exo-button px-4"
                  >
                    <ArrowDownToLine size={14} />
                    {isActive
                      ? "Loaded in simulator"
                      : "Load system"}
                  </button>

                  <a
                    href={preset.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open NASA data for ${preset.name}`}
                    title="Open NASA source"
                    className="exo-icon-button"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            );
          },
        )}
      </div>

      <p className="mt-5 max-w-4xl border-l border-white/[0.1] pl-4 text-[11px] leading-5 text-stone-600">
        Radius values are rounded from published archive measurements.
        Systems load at a standardized edge-on angle so their predicted
        transits can be compared clearly.
      </p>
    </section>
  );
}