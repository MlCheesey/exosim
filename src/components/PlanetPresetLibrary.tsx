import { ExternalLink } from "lucide-react";

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
  onLoadPreset: (preset: ExoplanetPreset) => void;
};

const PRESETS: ExoplanetPreset[] = [
  {
    name: "Kepler-10 b",
    planetType: "Super Earth",
    planetRadius: 1.47,
    starRadius: 1.06,
    orbitalPeriod: 0.84,
    discoveryYear: 2011,
    description: "A hot rocky world and one of the first confirmed terrestrial planets discovered by Kepler.",
    sourceUrl: "https://exoplanetarchive.ipac.caltech.edu/overview/Kepler-10",
  },
  {
    name: "Kepler-186 f",
    planetType: "Super Earth",
    planetRadius: 1.17,
    starRadius: 0.52,
    orbitalPeriod: 129.9,
    discoveryYear: 2014,
    description: "An Earth-sized world orbiting within the habitable zone of a cool red dwarf star.",
    sourceUrl: "https://exoplanetarchive.ipac.caltech.edu/overview/Kepler-186",
  },
  {
    name: "Kepler-20 e",
    planetType: "Terrestrial",
    planetRadius: 0.82,
    starRadius: 0.94,
    orbitalPeriod: 6.1,
    discoveryYear: 2011,
    description: "A small, intensely heated rocky planet orbiting close to its Sun-like host star.",
    sourceUrl: "https://exoplanetarchive.ipac.caltech.edu/overview/Kepler-20",
  },
];

export default function ExoplanetLibrary({ activePlanetName, onLoadPreset }: ExoplanetLibraryProps) {
  return (
    <section id="library" className="max-w-7xl mx-auto p-4 sm:p-6 py-12">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-stone-50 tracking-tight">Load Known Planets</h2>
        <p className="mt-2 text-sm text-stone-400">
          Apply confirmed data from the NASA Exoplanet Archive to the simulator.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRESETS.map((planet) => {
          const isActive = activePlanetName === planet.name;

          return (
            <article
              key={planet.name}
              className={`flex flex-col bg-stone-900/40 p-6 rounded-lg transition-colors border ${
                isActive ? "border-amber-500" : "border-stone-800 hover:border-stone-700"
              }`}
            >
              <header className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-stone-100">{planet.name}</h3>
                  <p className="text-xs text-amber-500 font-mono uppercase tracking-widest mt-1">
                    {planet.planetType}
                  </p>
                </div>
                {isActive && (
                  <span
                    className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded font-mono uppercase tracking-wider"
                    aria-label="Currently active preset"
                  >
                    Active
                  </span>
                )}
              </header>

              <dl className="space-y-2 mb-6 text-sm font-mono flex-grow">
                <div className="flex justify-between">
                  <dt className="text-stone-500">Planet Radius</dt>
                  <dd className="text-stone-300">{planet.planetRadius} R⊕</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Star Radius</dt>
                  <dd className="text-stone-300">{planet.starRadius} R☉</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Orbital Period</dt>
                  <dd className="text-stone-300">{planet.orbitalPeriod} days</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Discovered</dt>
                  <dd className="text-stone-300">{planet.discoveryYear}</dd>
                </div>
              </dl>

              <p className="text-sm text-stone-400 mb-8 min-h-[3rem] leading-relaxed">
                {planet.description}
              </p>

              <div className="flex gap-3 mt-auto">
                <button
                  type="button"
                  onClick={() => onLoadPreset(planet)}
                  className="exo-button flex-1"
                  disabled={isActive}
                  aria-pressed={isActive}
                >
                  {isActive ? "Loaded" : "Load Data"}
                </button>
                <a
                  href={planet.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="exo-icon-button"
                  aria-label={`View NASA Exoplanet Archive data for ${planet.name}`}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
