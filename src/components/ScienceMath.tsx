import {
  Calculator,
  CircleDot,
  Orbit,
  Telescope,
} from "lucide-react";

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
  return (
    <section
      id="science"
      className="mx-auto mt-5 max-w-[1500px] border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Calculator
            className="mt-1 text-amber-300"
            size={21}
          />

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300">
              Science Math
            </p>

            <h2 className="mt-1 text-xl font-semibold text-stone-50">
              How the transit signal is calculated
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-500">
              When a planet crosses its star, it blocks part of the
              star&apos;s visible surface. The amount of blocked light
              depends mainly on the radius of the planet compared with
              the radius of the star.
            </p>
          </div>
        </div>

        <div className="border-l-2 border-rose-400 bg-[#0A0908] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
            Current geometry
          </p>

          <p className="mt-1 font-mono text-sm text-rose-300">
            {transitGeometry}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[#332B22] bg-[#090807] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <CircleDot size={18} className="text-amber-300" />

            <h3 className="font-medium text-stone-200">
              Transit-depth equation
            </h3>
          </div>

          <div className="mt-6 border-y border-[#2A2620] py-7 text-center">
            <p className="font-mono text-2xl text-stone-100 sm:text-3xl">
              ΔF / F = (Rₚ / R★)²
            </p>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-6 text-stone-400">
            <p>
              <span className="font-mono text-amber-200">ΔF / F</span>
              {" "}is the fraction of starlight lost during the transit.
            </p>

            <p>
              <span className="font-mono text-amber-200">Rₚ</span>
              {" "}is the planet radius, and{" "}
              <span className="font-mono text-amber-200">R★</span>
              {" "}is the star radius.
            </p>

            <p>
              The radius ratio is squared because the amount of light
              blocked depends on circular area, not only width.
            </p>
          </div>
        </div>

        <div className="border border-[#332B22] bg-[#090807] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Telescope size={18} className="text-rose-300" />

            <h3 className="font-medium text-stone-200">
              Live calculation
            </h3>
          </div>

          <div className="mt-5 divide-y divide-[#2A2620] border-y border-[#2A2620]">
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-stone-500">
                Planet radius
              </span>

              <span className="font-mono text-sm text-amber-200">
                {planetRadius.toFixed(1)} R⊕
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-stone-500">
                Star radius
              </span>

              <span className="font-mono text-sm text-stone-200">
                {starRadius.toFixed(1)} R☉
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-stone-500">
                Radius ratio
              </span>

              <span className="font-mono text-sm text-stone-200">
                {radiusRatio.toFixed(5)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-stone-500">
                Maximum transit depth
              </span>

              <span className="font-mono text-sm text-rose-300">
                {maximumTransitDepthPercent.toFixed(4)}%
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-stone-500">
                Orbit inclination
              </span>

              <span className="font-mono text-sm text-stone-200">
                {orbitalInclination.toFixed(0)}°
              </span>
            </div>
          </div>

          <div className="mt-5 border-l-2 border-amber-400 bg-amber-500/[0.04] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
              Observable signal
            </p>

            <p className="mt-1 font-mono text-2xl text-rose-300">
              {effectiveTransitDepthPercent.toFixed(4)}%
            </p>

            <p className="mt-2 text-xs leading-5 text-stone-500">
              Inclination determines whether the planet fully crosses,
              grazes, or misses the visible surface of the star.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-px overflow-hidden border border-[#2A2620] bg-[#2A2620] md:grid-cols-3">
        <div className="bg-[#0B0A08] p-4">
          <Orbit size={17} className="text-amber-300" />

          <p className="mt-3 text-sm font-medium text-stone-200">
            Edge-on orbit
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            Near 90°, the planet crosses the star and produces the
            strongest transit signal.
          </p>
        </div>

        <div className="bg-[#0B0A08] p-4">
          <Orbit size={17} className="text-rose-300" />

          <p className="mt-3 text-sm font-medium text-stone-200">
            Grazing orbit
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            The planet only covers the edge of the star, creating a
            shallower brightness dip.
          </p>
        </div>

        <div className="bg-[#0B0A08] p-4">
          <Orbit size={17} className="text-stone-500" />

          <p className="mt-3 text-sm font-medium text-stone-200">
            Missed transit
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            At lower inclinations, the planet passes above or below the
            star and no transit is detected.
          </p>
        </div>
      </div>
    </section>
  );
}