"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import HowToUse from "@/components/HowToUse";
import { LightCurveChart } from "@/components/LightCurveChart";
import OrbitalScene from "@/components/OrbitalScene";
import ExoplanetLibrary, { type ExoplanetPreset } from "@/components/PlanetPresetLibrary";
import ScienceMath from "@/components/ScienceMath";
import { calculateTransitVisibility, getTransitGeometry } from "@/lib/transitMath";

const EARTH_RADII_PER_SOLAR_RADIUS = 109.1;
const DEGREES_TO_RADIANS = Math.PI / 180;
const ORBIT_MISS_SCALE = 13;

const rangeClass = "mt-3 w-full accent-amber-600";

type SimSettings = {
  planetRadius: number;
  starRadius: number;
  inclination: number;
  speed: number;
  noisePpm: number;
};

type SliderControlProps = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  precision?: number;
  note?: string;
  onChange: (value: number) => void;
};

function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-lg border border-stone-800 bg-stone-900 ${className}`}>
      {children}
    </section>
  );
}

function SliderControl({
  label,
  value,
  unit,
  min,
  max,
  step,
  precision = 2,
  note,
  onChange,
}: SliderControlProps) {
  return (
    <label className="block py-4">
      <span className="flex justify-between gap-4">
        <span className="text-sm text-stone-300">{label}</span>
        <span className="font-mono text-sm">
          {value.toFixed(precision)} {unit}
        </span>
      </span>
      {note ? <p className="mt-1 text-xs text-stone-500">{note}</p> : null}
      <input
        className={rangeClass}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function useTransitCalculations(settings: Pick<SimSettings, "planetRadius" | "starRadius" | "inclination">) {
  return useMemo(() => {
    const rPlanet = settings.planetRadius / EARTH_RADII_PER_SOLAR_RADIUS;
    const ratio = rPlanet / settings.starRadius;
    const maxDepth = ratio ** 2 * 100;
    const angle = settings.inclination * DEGREES_TO_RADIANS;
    const miss = Math.abs(Math.cos(angle)) * ORBIT_MISS_SCALE;
    const visible = calculateTransitVisibility(rPlanet, settings.starRadius, miss);
    const depth = maxDepth * visible;
    const geometry = getTransitGeometry(visible);

    return {
      planetRadius: settings.planetRadius,
      starRadius: settings.starRadius,
      inclination: settings.inclination,
      ratio,
      maxDepth,
      depth,
      geometry,
    };
  }, [settings.inclination, settings.planetRadius, settings.starRadius]);
}

export default function Home() {
  const [settings, setSettings] = useState<SimSettings>({
    planetRadius: 1,
    starRadius: 1,
    inclination: 89,
    speed: 1,
    noisePpm: 35,
  });
  const [phase, setPhase] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [activePlanet, setActivePlanet] = useState<string>();
  const [isPaused, setIsPaused] = useState(false);

  const { planetRadius, starRadius, inclination, speed, noisePpm } = settings;
  const transit = useTransitCalculations(settings);
  const { depth, geometry } = transit;

  function updateSetting(key: keyof SimSettings, value: number) {
    setSettings((current) => ({ ...current, [key]: value }));
    setActivePlanet(undefined);
  }

  function loadPreset(planet: ExoplanetPreset) {
    setSettings({
      planetRadius: planet.planetRadius,
      starRadius: planet.starRadius,
      inclination: planet.inclination ?? 89,
      noisePpm: planet.noisePpm ?? 35,
      speed: planet.suggestedSpeed ?? 1,
    });
    setActivePlanet(planet.name);
    setIsPaused(false);
    setPhase(0);
    setResetCount((count) => count + 1);
  }

  return (
    <main className="min-h-screen bg-background text-stone-200">
      <header className="border-b border-stone-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href="#lab" className="font-display text-xl font-semibold text-stone-50">
            ExoSim
          </a>

          <nav className="hidden gap-5 text-sm text-stone-400 sm:flex">
            <a href="#lab">Lab</a>
            <a href="#library">Planets</a>
            <a href="#science">Math</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="max-w-3xl">
          <p className="text-sm text-stone-500">Transit photometry simulator</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-stone-50">
            Exoplanet light-curve simulator
          </h1>
          <p className="mt-3 leading-7 text-stone-400">
            Adjust the star, planet, orbit angle, and sensor noise to see how a
            transit changes the measured brightness.
          </p>
        </section>

        <div className="mt-7">
          <HowToUse />
        </div>

        <section id="lab" className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Panel className="overflow-hidden lg:col-span-2">
            <div className="border-b border-stone-800 p-4 sm:flex sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-50">Orbit view</h2>
                <p className="mt-1 text-sm text-stone-500">
                  {activePlanet ? `Loaded preset: ${activePlanet}` : "Custom values"}
                </p>
              </div>

              <div className="mt-4 flex gap-2 sm:mt-0">
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-700 bg-stone-950 px-3 text-sm font-medium text-stone-100 hover:border-amber-700 hover:text-amber-200"
                  onClick={() => setIsPaused((paused) => !paused)}
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  {isPaused ? "Resume" : "Pause"}
                </button>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-700 bg-stone-950 text-stone-100 hover:border-amber-700 hover:text-amber-200"
                  onClick={() => {
                    setPhase(0);
                    setResetCount((count) => count + 1);
                  }}
                  aria-label="Reset orbit"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            <div className="h-[420px] bg-black sm:h-[540px]">
              <OrbitalScene
                planetRadius={planetRadius}
                starRadius={starRadius}
                planetName={activePlanet}
                orbitalInclination={inclination}
                isPaused={isPaused}
                simulationSpeed={speed}
                resetSignal={resetCount}
                onOrbitUpdate={setPhase}
              />
            </div>

            <div className="grid gap-4 border-t border-stone-800 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-stone-500">phase</p>
                <p className="mt-1 font-mono text-lg text-stone-100">{phase.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500">geometry</p>
                <p className="mt-1 font-mono text-lg text-stone-100">{geometry}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500">visible depth</p>
                <p className="mt-1 font-mono text-lg text-stone-100">{depth.toFixed(4)}%</p>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <h2 className="font-display text-xl font-semibold text-stone-50">Controls</h2>
            <p className="mt-1 text-sm text-stone-500">
              Radius changes the depth. Inclination changes whether a transit happens.
            </p>

            <div className="mt-5 divide-y divide-stone-800">
              <SliderControl
                label="Planet radius"
                value={planetRadius}
                unit="R⊕"
                min={0.5}
                max={16}
                step={0.05}
                onChange={(value) => updateSetting("planetRadius", value)}
              />

              <SliderControl
                label="Star radius"
                value={starRadius}
                unit="R☉"
                min={0.2}
                max={2}
                step={0.01}
                onChange={(value) => updateSetting("starRadius", value)}
              />

              <SliderControl
                label="Inclination"
                value={inclination}
                unit="°"
                min={60}
                max={90}
                step={1}
                precision={0}
                note="90° means the orbit is edge-on."
                onChange={(value) => updateSetting("inclination", value)}
              />

              <SliderControl
                label="Orbit speed"
                value={speed}
                unit="x"
                min={0.4}
                max={3}
                step={0.1}
                precision={1}
                onChange={(value) => updateSetting("speed", value)}
              />

              <SliderControl
                label="Sensor noise"
                value={noisePpm}
                unit="ppm"
                min={0}
                max={200}
                step={5}
                precision={0}
                onChange={(value) => updateSetting("noisePpm", value)}
              />
            </div>
          </Panel>
        </section>

        <Panel className="mt-5 p-4">
          <h2 className="font-display text-xl font-semibold text-stone-50">Light curve</h2>
          <p className="mt-1 text-sm text-stone-500">
            The graph draws one orbit and marks the planet&apos;s current position.
          </p>
          <div className="mt-4 h-[360px] sm:h-[430px]">
            <LightCurveChart orbitalPhase={phase} transitDepthPercent={depth} noisePpm={noisePpm} />
          </div>
        </Panel>

        <ExoplanetLibrary active={activePlanet} onLoad={loadPreset} />

        <ScienceMath data={transit} />
      </div>
    </main>
  );
}
