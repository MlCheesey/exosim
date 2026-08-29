import clsx from "clsx";
import { ExternalLink } from "lucide-react";
import { exoplanetPresets, type ExoplanetPreset } from "@/data/presets";

export type { ExoplanetPreset };

type ExoplanetLibraryProps = {
  active?: string;
  onLoad: (preset: ExoplanetPreset) => void;
};

function MetricRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string | number;
  last?: boolean;
}) {
  return (
    <div className={clsx("flex justify-between gap-4 py-2", !last && "border-b border-stone-800/70")}>
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right text-stone-300">{value}</dd>
    </div>
  );
}

function ExoplanetCard({
  planet,
  isActive,
  onLoad,
}: {
  planet: ExoplanetPreset;
  isActive: boolean;
  onLoad: (preset: ExoplanetPreset) => void;
}) {
  const metrics = [
    ["planet", `${planet.planetRadius} R⊕`],
    ["star", `${planet.starRadius} R☉`],
    ["period", `${planet.orbitalPeriod} d`],
    ["found", planet.discoveryYear],
  ];

  return (
    <article
      className={clsx(
        "flex min-h-full flex-col rounded-md border bg-stone-950/35 p-5",
        isActive && "border-amber-600",
        !isActive && "border-stone-800",
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-stone-100">
            {planet.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-amber-300">
            {planet.planetType}
          </p>
        </div>
        {isActive ? (
          <span className="rounded border border-amber-700/50 px-2 py-1 font-mono text-xs text-amber-200">
            loaded
          </span>
        ) : null}
      </div>

      <dl className="mb-5 font-mono text-xs">
        {metrics.map(([label, value], index) => (
          <MetricRow
            key={label}
            label={String(label)}
            value={value}
            last={index === metrics.length - 1}
          />
        ))}
      </dl>

      <p className="mb-6 flex-1 text-sm leading-6 text-stone-400">{planet.description}</p>

      <div className="mt-auto flex gap-2">
        <button
          type="button"
          className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-stone-700 bg-stone-950 px-3 text-sm font-medium text-stone-100 hover:border-amber-700 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isActive}
          onClick={() => onLoad(planet)}
        >
          {isActive ? "Loaded" : "Load"}
        </button>
        <a
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-700 bg-stone-950 text-stone-100 hover:border-amber-700 hover:text-amber-200"
          href={planet.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open NASA archive page for ${planet.name}`}
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </article>
  );
}

export default function ExoplanetLibrary({
  active,
  onLoad,
}: ExoplanetLibraryProps) {
  return (
    <section id="library" className="py-10">
      <div className="mb-6 max-w-2xl">
        <p className="text-sm text-stone-500">Preset systems</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-stone-50">
          Known planets
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-400">
          A few real systems for testing different transit depths.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {exoplanetPresets.map((planet) => (
          <ExoplanetCard
            key={planet.name}
            planet={planet}
            isActive={planet.name === active}
            onLoad={onLoad}
          />
        ))}
      </div>
    </section>
  );
}
