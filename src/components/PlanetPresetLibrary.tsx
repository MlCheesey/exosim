import {
  ArrowDownToLine,
  ExternalLink,
  Library,
  Orbit,
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
      className="mx-auto mt-5 max-w-[1500px] border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Library
            className="mt-1 text-amber-300"
            size={21}
          />

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300">
              NASA Data Library
            </p>

            <h2 className="mt-1 text-xl font-semibold text-stone-50">
              Explore confirmed exoplanets
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-500">
              Load real planetary and stellar measurements into
              ExoSim and compare the transit signals produced by
              different systems.
            </p>
          </div>
        </div>

        <div className="border-l-2 border-amber-400 bg-[#0A0908] px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
            Data source
          </p>

          <p className="mt-1 font-mono text-xs text-amber-200">
            NASA Exoplanet Archive
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {exoplanetPresets.map((preset, index) => {
          const isActive =
            activePlanetName === preset.name;

          return (
            <article
              key={preset.name}
              className={
                isActive
                  ? "border border-amber-400/60 bg-[#0C0A07]"
                  : "border border-[#332B22] bg-[#090807]"
              }
            >
              <div className="flex items-start justify-between border-b border-[#2A2620] p-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                    Archive target{" "}
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-stone-100">
                    {preset.name}
                  </h3>

                  <p className="mt-1 font-mono text-xs text-rose-300">
                    {preset.planetType}
                  </p>
                </div>

                <Orbit
                  className={
                    isActive
                      ? "text-amber-300"
                      : "text-stone-600"
                  }
                  size={20}
                />
             </div>
              <div className="divide-y divide-[#2A2620] px-5">
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-xs text-stone-500">
                    Planet radius
                  </span>
                  <span className="font-mono text-xs text-amber-200">
                    {preset.planetRadius.toFixed(2)} R
                  </span>                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-xs text-stone-500">
                    Star radius
                  </span>
                  <span className="font-mono text-xs text-stone-300">
                    {preset.starRadius.toFixed(2)} R
                  </span>                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-xs text-stone-500">
                    Orbital period
                  </span>
                  <span className="font-mono text-xs text-stone-300">
                    {preset.orbitalPeriod} days
                  </span>                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-xs text-stone-500">
                    Discovery
                  </span>
                  <span className="font-mono text-xs text-stone-300">
                    {preset.discoveryYear}
                  </span>                </div>              </div>
              <div className="p-5">
                <p className="min-h-16 text-xs leading-5 text-stone-500">
                  {preset.description}
                </p>
                <div className="mt-5 grid grid-cols-[1fr_auto] border border-[#3A3024]">
                  <button                    type="button"
                    onClick={() => {
                      onLoadPreset(preset);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-200 transition hover:bg-amber-500/10 hover:text-amber-200"
                  >
                    <ArrowDownToLine size={14} />

                    {isActive
                      ? "Loaded"
                      : "Load into lab"}
                  </button>
                  <a                    href={preset.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open NASA data for ${preset.name}`}
                    title="Open NASA source"
                    className="flex w-11 items-center justify-center border-l border-[#3A3024] text-stone-500 transition hover:bg-amber-500/10 hover:text-amber-200"
                  >
                    <ExternalLink size={14} />
                  </a>                </div>              </div>            </article>          );
        })}
      </div>
      <p className="mt-4 border-l-2 border-stone-700 pl-3 text-xs leading-5 text-stone-600">
        Radius values are rounded from published archive measurements.
        ExoSim uses a standardized edge-on viewing angle when loading a
        system so its predicted transit can be compared clearly.
      </p>    </section>  );
}