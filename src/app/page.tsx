"use client";

import { useCallback, useState } from "react";
import {
  Database,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  Sigma,
} from "lucide-react";
import { LightCurveChart } from "@/components/LightCurveChart";
import OrbitalScene from "@/components/OrbitalScene";
import ScienceMath from "@/components/ScienceMath";
import ExoplanetLibrary, {
  type ExoplanetPreset,
} from "@/components/PlanetPresetLibrary";
import {
  calculateTransitVisibility,
  getTransitGeometry,
} from "@/lib/transitMath";

export default function Home() {
  const [planetRadius, setPlanetRadius] = useState(1);
  const [starRadius, setStarRadius] = useState(1);
  const [orbitalInclination, setOrbitalInclination] =
    useState(90);
  const [noisePpm, setNoisePpm] = useState(50);
  const [orbitalPhase, setOrbitalPhase] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [simulationSpeed, setSimulationSpeed] =
    useState(1);
  const [resetSignal, setResetSignal] = useState(0);

  const [activePlanetName, setActivePlanetName] =
    useState<string | undefined>(undefined);

  const solarRadiusInEarthRadii = 109.1;

  const planetToStarRadiusRatio =
    planetRadius /
    (starRadius * solarRadiusInEarthRadii);

  const maximumTransitDepthPercent =
    planetToStarRadiusRatio ** 2 * 100;

  const renderedPlanetRadius =
    0.38 * planetRadius;

  const renderedStarRadius =
    1.35 * starRadius;

  const inclinationRadians =
    (orbitalInclination * Math.PI) / 180;

  const projectedTransitOffset = Math.abs(
    0.12 +
      4 * Math.cos(inclinationRadians),
  );

  const transitVisibility =
    calculateTransitVisibility(
      renderedPlanetRadius,
      renderedStarRadius,
      projectedTransitOffset,
    );

  const effectiveTransitDepthPercent =
    maximumTransitDepthPercent *
    transitVisibility;

  const transitGeometry =
    getTransitGeometry(
      transitVisibility,
    );

  const handleOrbitUpdate = useCallback(
    (phase: number) => {
      setOrbitalPhase(phase);
    },
    [],
  );

  function handleReset() {
    setResetSignal((current) => current + 1);
    setOrbitalPhase(0);
  }

  function handleLoadPreset(
    preset: ExoplanetPreset,
  ) {
    setPlanetRadius(preset.planetRadius);
    setStarRadius(preset.starRadius);
    setOrbitalInclination(90);
    setActivePlanetName(preset.name);
    setIsPaused(false);
    setResetSignal((current) => current + 1);
    setOrbitalPhase(0);

    window.location.hash = "lab";
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] px-3 py-3 text-stone-100 sm:px-6 sm:py-5">
      <header className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-3 rounded-lg border border-[#2A2620] bg-[#11100E]/90 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-300 sm:size-10">
            <Orbit size={21} />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-stone-50 sm:text-xl">
              ExoSim
            </h1>

            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs sm:tracking-[0.24em]">
              Exoplanet Transit Lab
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-stone-400 md:flex">
          <a
            href="#lab"
            className="transition hover:text-amber-300"
          >
            Lab
          </a>

          <a
            href="#library"
            className="transition hover:text-amber-300"
          >
            NASA Library
          </a>

          <a
            href="#science"
            className="transition hover:text-amber-300"
          >
            Science Math
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 border-l-2 border-amber-400/70 pl-3 font-mono text-[9px] uppercase tracking-[0.14em] text-amber-200 sm:text-[10px] sm:tracking-[0.18em]">
          <span className="size-1.5 bg-amber-300" />

          <span>
            <span className="hidden sm:inline">
              Telemetry{" "}
            </span>
            active
          </span>
        </div>

        <nav className="order-3 grid w-full grid-cols-3 border-t border-[#2A2620] pt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-stone-500 md:hidden">
          <a
            href="#lab"
            className="border-r border-[#2A2620] py-1 transition hover:text-amber-300"
          >
            Lab
          </a>

          <a
            href="#library"
            className="border-r border-[#2A2620] py-1 transition hover:text-amber-300"
          >
            NASA Library
          </a>

          <a
            href="#science"
            className="py-1 transition hover:text-amber-300"
          >
            Science Math
          </a>
        </nav>
      </header>

      <section
        id="lab"
        className="mx-auto mt-4 grid w-full max-w-[1500px] gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_330px]"
      >
        <div className="min-w-0 rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-stone-50 sm:text-lg">
                Orbital View
              </h2>

              <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                Live 3D view of the star and orbiting exoplanet
              </p>
            </div>

            <Orbit
              className="shrink-0 text-amber-300"
              size={21}
            />
          </div>

          <div className="relative h-[500px] min-w-0 overflow-hidden rounded-lg border border-[#2A2620] bg-[#050505] sm:h-[520px] lg:h-auto lg:aspect-[16/10]">
            <OrbitalScene
              planetRadius={planetRadius}
              starRadius={starRadius}
              planetName={activePlanetName}
              orbitalInclination={
                orbitalInclination
              }
              isPaused={isPaused}
              simulationSpeed={simulationSpeed}
              resetSignal={resetSignal}
              onOrbitUpdate={handleOrbitUpdate}
            />

            <div className="absolute left-3 right-3 top-3 z-10 border border-[#44392C] bg-[#0A0907]/92 shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur-md sm:left-auto sm:right-4 sm:top-4">
              <div className="grid grid-cols-[minmax(0,1fr)_44px] sm:flex sm:items-stretch">
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(
                      (current) => !current,
                    );
                  }}
                  className="flex min-w-0 items-center justify-center gap-2 border-r border-[#44392C] px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-stone-200 transition hover:bg-amber-500/10 hover:text-amber-200 sm:min-w-24 sm:py-2"
                >
                  {isPaused ? (
                    <Play size={14} />
                  ) : (
                    <Pause size={14} />
                  )}

                  {isPaused ? "Resume" : "Pause"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset orbit"
                  title="Reset orbit"
                  className="flex w-11 items-center justify-center text-stone-400 transition hover:bg-amber-500/10 hover:text-amber-200 sm:w-10 sm:border-r sm:border-[#44392C]"
                >
                  <RotateCcw size={14} />
                </button>

                <div className="col-span-2 w-full border-t border-[#44392C] px-3 py-2 sm:col-span-1 sm:w-44 sm:border-t-0 sm:py-1.5">
                  <div className="mb-1 flex items-center justify-between sm:mb-0.5">
                    <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-stone-600">
                      Speed
                    </span>

                    <span className="font-mono text-[10px] text-amber-200">
                      {simulationSpeed.toFixed(1)}×
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.2"
                    max="3"
                    step="0.1"
                    value={simulationSpeed}
                    onChange={(event) => {
                      setSimulationSpeed(
                        Number(event.target.value),
                      );
                    }}
                    aria-label="Simulation speed"
                    className="h-1 w-full cursor-pointer accent-amber-400"
                  />

                  <div className="mt-1 flex justify-between font-mono text-[8px] text-stone-600 sm:mt-0.5">
                    <span>0.2×</span>
                    <span>1.6×</span>
                    <span>3.0×</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-3 left-3 right-3 border-l-2 border-amber-400/60 bg-[#0B0907]/80 px-3 py-3 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-auto sm:py-2">
              <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:flex sm:items-center sm:gap-5">
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-stone-600 sm:text-[9px] sm:tracking-[0.2em]">
                    Target
                  </p>

                  <p className="mt-1 truncate font-mono text-[10px] text-amber-200 sm:text-xs">
                    {activePlanetName ?? "EXO-001"}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-stone-600 sm:text-[9px] sm:tracking-[0.2em]">
                    Orbital phase
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-stone-300 sm:text-xs">
                    {orbitalPhase.toFixed(3)}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-stone-600 sm:text-[9px] sm:tracking-[0.2em]">
                    Inclination
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-stone-300 sm:text-xs">
                    {orbitalInclination.toFixed(0)}°
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-stone-600 sm:text-[9px] sm:tracking-[0.2em]">
                    State
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-stone-300 sm:text-xs">
                    {isPaused ? "PAUSED" : "RUNNING"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="min-w-0 rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-stone-50 sm:text-lg">
                Mission Controls
              </h2>

              <p className="text-xs text-stone-500 sm:text-sm">
                Simulation parameters
              </p>
            </div>

            <Sigma
              className="shrink-0 text-rose-300"
              size={21}
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-md border border-[#3A3024] bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Planet Radius
                  </p>

                  <p className="mt-1 font-mono text-xl text-amber-200 sm:text-2xl">
                    {planetRadius.toFixed(2)} R⊕
                  </p>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
                  Input 01
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="2"
                step="0.01"
                value={planetRadius}
                onChange={(event) => {
                  setPlanetRadius(
                    Number(event.target.value),
                  );

                  setActivePlanetName(undefined);
                }}
                aria-label="Planet radius"
                className="mt-5 h-1.5 w-full cursor-pointer accent-amber-400"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-stone-600">
                <span>0.5 R⊕</span>
                <span>2.0 R⊕</span>
              </div>
            </div>

            <div className="rounded-md border border-[#3A3024] bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Star Radius
                  </p>

                  <p className="mt-1 font-mono text-xl text-stone-200 sm:text-2xl">
                    {starRadius.toFixed(2)} R☉
                  </p>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
                  Input 02
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={starRadius}
                onChange={(event) => {
                  setStarRadius(
                    Number(event.target.value),
                  );

                  setActivePlanetName(undefined);
                }}
                aria-label="Star radius"
                className="mt-5 h-1.5 w-full cursor-pointer accent-stone-300"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-stone-600">
                <span>0.5 R☉</span>
                <span>1.5 R☉</span>
              </div>
            </div>

            <div className="rounded-md border border-[#3A3024] bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Orbit Inclination
                  </p>

                  <p className="mt-1 font-mono text-xl text-amber-200 sm:text-2xl">
                    {orbitalInclination.toFixed(0)}°
                  </p>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
                  Input 03
                </span>
              </div>

              <input
                type="range"
                min="60"
                max="90"
                step="1"
                value={orbitalInclination}
                onChange={(event) => {
                  setOrbitalInclination(
                    Number(event.target.value),
                  );
                }}
                aria-label="Orbital inclination"
                className="mt-5 h-1.5 w-full cursor-pointer accent-amber-400"
              />

              <div className="mt-2 flex justify-between font-mono text-[9px] text-stone-600 sm:text-[10px]">
                <span>60° tilted</span>
                <span>75°</span>
                <span>90° edge-on</span>
              </div>

              <p className="mt-3 border-t border-[#2A2620] pt-3 text-xs leading-relaxed text-stone-600">
                Lower angles move the planet above or below the star
              </p>
            </div>

            <div className="rounded-md border border-[#3A3024] bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Observation Noise
                  </p>

                  <p className="mt-1 font-mono text-xl text-stone-200 sm:text-2xl">
                    {noisePpm.toFixed(0)} ppm
                  </p>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
                  Input 04
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={noisePpm}
                onChange={(event) => {
                  setNoisePpm(
                    Number(event.target.value),
                  );
                }}
                aria-label="Observation noise"
                className="mt-5 h-1.5 w-full cursor-pointer accent-rose-300"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-stone-600">
                <span>0 ppm</span>
                <span>150 ppm</span>
                <span>300 ppm</span>
              </div>
            </div>

            <div className="rounded-md border border-rose-500/20 bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Transit Signal
                  </p>

                  <p className="mt-1 font-mono text-xl text-rose-300 sm:text-2xl">
                    {effectiveTransitDepthPercent.toFixed(4)}%
                  </p>
                </div>

                <div
                  className={
                    transitGeometry === "No transit"
                      ? "flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-stone-500"
                      : transitGeometry === "Grazing"
                        ? "flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-200"
                        : "flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-rose-300"
                  }
                >
                  <span
                    className={
                      transitGeometry === "No transit"
                        ? "size-1.5 bg-stone-600"
                        : transitGeometry === "Grazing"
                          ? "size-1.5 bg-amber-300"
                          : "size-1.5 bg-rose-300"
                    }
                  />

                  {transitGeometry}
                </div>
              </div>

              <div className="mt-4 border-t border-[#2A2620] pt-3">
                <p className="font-mono text-xs text-stone-500">
                  Maximum signal · {maximumTransitDepthPercent.toFixed(4)}%
                </p>

                <p className="mt-1 text-xs text-stone-600">
                  Visible signal after exact disk-overlap calculation
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-4 w-full max-w-[1500px] min-w-0 rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:mt-5 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <Database
              className="mt-1 shrink-0 text-rose-300"
              size={20}
            />

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-stone-50 sm:text-lg">
                Live Light-Curve
              </h2>

              <p className="mt-1 text-xs leading-5 text-stone-500 sm:text-sm">
                Theoretical model and simulated telescope observation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l-2 border-rose-400/70 pl-3 font-mono text-[9px] uppercase tracking-[0.14em] text-rose-300 sm:text-[10px] sm:tracking-[0.18em]">
            <span className="size-1.5 animate-pulse bg-rose-300" />
            Photometry / live
          </div>
        </div>

        <div className="h-[340px] min-w-0 rounded-md border border-[#2A2620] bg-[#090807] p-2 sm:h-[400px] sm:p-5">
          <LightCurveChart
            orbitalPhase={orbitalPhase}
            transitDepthPercent={
              effectiveTransitDepthPercent
            }
            noisePpm={noisePpm}
          />
        </div>
      </section>

      <ExoplanetLibrary
        activePlanetName={activePlanetName}
        onLoadPreset={handleLoadPreset}
      />

      <ScienceMath
        planetRadius={planetRadius}
        starRadius={starRadius}
        orbitalInclination={
          orbitalInclination
        }
        radiusRatio={
          planetToStarRadiusRatio
        }
        maximumTransitDepthPercent={
          maximumTransitDepthPercent
        }
        effectiveTransitDepthPercent={
          effectiveTransitDepthPercent
        }
        transitGeometry={transitGeometry}
      />
    </main>
  );
}
