import type { TransitGeometry } from "@/lib/transitMath";

export type ScienceMathData = {
  planetRadius: number;
  starRadius: number;
  inclination: number;
  ratio: number;
  maxDepth: number;
  depth: number;
  geometry: TransitGeometry;
};

type ScienceMathProps = {
  data: ScienceMathData;
};

const geometryNotes = [
  ["Full transit", "The planet crosses the star cleanly."],
  ["Grazing", "Only part of the planet crosses the star."],
  ["No transit", "The orbit misses the star from our viewing angle."],
];

export default function ScienceMath({ data }: ScienceMathProps) {
  const rows = [
    ["planet radius", `${data.planetRadius.toFixed(2)} R⊕`],
    ["star radius", `${data.starRadius.toFixed(2)} R☉`],
    ["radius ratio", data.ratio.toFixed(5)],
    ["maximum depth", `${data.maxDepth.toFixed(4)}%`],
    ["visible depth", `${data.depth.toFixed(4)}%`],
  ];

  return (
    <section id="science" className="pb-16 pt-8">
      <div className="mb-6 max-w-3xl">
        <p className="text-sm text-stone-500">Science notes</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-stone-50">
          The math
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-400">
          The basic idea is area. A bigger planet blocks more light, and a bigger
          star makes the same planet harder to detect.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-stone-800 bg-stone-900 p-5">
          <p className="text-sm text-stone-500">Equation</p>
          <p className="mt-4 font-mono text-3xl text-amber-200 sm:text-4xl">
            ΔF / F = (Rₚ / R★)²
          </p>
          <p className="mt-5 text-sm leading-6 text-stone-400">
            The radius ratio gets squared because area grows with radius squared.
            The simulator then reduces that number when the transit is only grazing.
          </p>
        </article>

        <article className="rounded-lg border border-stone-800 bg-stone-900 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-stone-500">Live numbers</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-stone-50">
                {data.geometry}
              </h3>
            </div>
            <p className="font-mono text-sm text-stone-400">{data.inclination.toFixed(0)}°</p>
          </div>

          <dl className="mt-4 text-sm">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-stone-800 py-3 last:border-b-0"
              >
                <dt className="text-stone-500">{label}</dt>
                <dd className="font-mono text-stone-200">{value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {geometryNotes.map(([label, description]) => (
          <article key={label} className="rounded-md border border-stone-800 bg-stone-950/30 p-4">
            <h3 className="font-medium text-stone-200">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
