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
  const geometries = [
    {
      name: "Edge-on",
      color: "bg-amber-500",
      description: "The planet perfectly crosses the stellar disk, producing a full transit signal.",
    },
    {
      name: "Grazing",
      color: "bg-rose-400",
      description: "The planet only obscures the very edge of the star, creating a shallow dip.",
    },
    {
      name: "Miss",
      color: "bg-stone-500",
      description: "The orbital inclination is too low; the planet does not cross the star from our perspective.",
    },
  ];

  return (
    <section id="science" className="max-w-7xl mx-auto p-4 sm:p-6 mb-20 border-t border-stone-800 mt-12 pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-stone-50 tracking-tight">
            Transit Photometry Math
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            Geometric state: <span className="text-stone-200 font-mono">{transitGeometry}</span>
          </p>
        </div>
        <div className="border-l-2 border-amber-500 pl-3">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-mono block">
            Inclination
          </span>
          <span className="font-mono text-stone-200 text-sm">{orbitalInclination}°</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <article className="bg-stone-900/40 p-6 border border-stone-800 rounded-lg">
          <h3 className="text-sm font-medium text-stone-400 uppercase tracking-widest mb-4">
            Base Equation
          </h3>
          <div className="font-mono text-3xl sm:text-4xl text-amber-500 mb-6 py-2">
            ΔF / F = (Rₚ / R★)²
          </div>
          <p className="text-stone-300 text-sm leading-relaxed">
            The fraction of starlight blocked (ΔF / F) is equal to the ratio of the planet's area to the star's area. Because the area of a circle is πr², the constants cancel out, leaving the square of the radius ratio.
          </p>
        </article>

        <article className="bg-stone-900/40 p-6 border border-stone-800 rounded-lg">
          <h3 className="text-sm font-medium text-stone-400 uppercase tracking-widest mb-4">
            Live Calculation
          </h3>

          <dl className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-stone-500">Planet Radius (Rₚ)</dt>
              <dd className="text-stone-200">{planetRadius.toFixed(2)} R⊕</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-stone-500">Star Radius (R★)</dt>
              <dd className="text-stone-200">{starRadius.toFixed(2)} R☉</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-stone-500">Radius Ratio</dt>
              <dd className="text-stone-200">{radiusRatio.toFixed(5)}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-stone-500">Maximum Possible Depth</dt>
              <dd className="text-stone-200">{maximumTransitDepthPercent.toFixed(4)}%</dd>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-stone-800">
              <dt className="text-stone-400 font-semibold">Effective Transit Depth</dt>
              <dd className="text-rose-400 font-semibold text-lg">
                {effectiveTransitDepthPercent.toFixed(4)}%
              </dd>
            </div>
          </dl>
        </article>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
        {geometries.map((geometry) => (
          <article
            key={geometry.name}
            className="p-5 border border-stone-800 rounded-lg bg-stone-900/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${geometry.color}`} aria-hidden="true" />
              <h4 className="font-semibold text-stone-200">{geometry.name}</h4>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">{geometry.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
