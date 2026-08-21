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

  const fullTransitLimit = Math.max(
    renderedStarRadius -
      renderedPlanetRadius,
    0,
  );

  const noTransitLimit =
    renderedStarRadius +
    renderedPlanetRadius;

  let transitVisibility = 1;

  if (
    projectedTransitOffset >= noTransitLimit
  ) {
    transitVisibility = 0;
  } else if (
    projectedTransitOffset >
    fullTransitLimit
  ) {
    transitVisibility =
      (noTransitLimit -
        projectedTransitOffset) /
      (noTransitLimit -
        fullTransitLimit);
  }

  const effectiveTransitDepthPercent =
    maximumTransitDepthPercent *
    transitVisibility;

  const transitGeometry =
    transitVisibility === 0
      ? "No transit"
      : transitVisibility < 0.999
        ? "Grazing"
        : "Full transit";

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

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-5 text-stone-100 sm:px-6">
      <header className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 rounded-lg border border-[#2A2620] bg-[#11100E]/90 px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-300">
            <Orbit size={22} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-stone-50">
              ExoSim
            </h1>

            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
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

        <div className="flex items-center gap-2 border-l-2 border-amber-400/70 pl-3 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200">
          <span className="size-1.5 bg-amber-300" />
          Telemetry active
        </div>
      </header>

      <section
        id="lab"
        className="mx-auto mt-6 grid max-w-[1500px] gap-5 lg:grid-cols-[minmax(0,1fr)_330px]"
      >
        <div className="rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Orbital View
              </h2>

              <p className="text-sm text-stone-500">
                Live 3D view of the star and orbiting exoplanet
              </p>
            </div>

            <Orbit
              className="text-amber-300"
              size={22}
            />
          </div>

          <div className="relative h-[440px] overflow-hidden rounded-lg border border-[#2A2620] bg-[#050505] sm:h-[520px] lg:h-auto lg:aspect-[16/10]">
            <OrbitalScene
              planetRadius={planetRadius}
              starRadius={starRadius}
              orbitalInclination={
                orbitalInclination
              }
              isPaused={isPaused}
              simulationSpeed={simulationSpeed}
              resetSignal={resetSignal}
              onOrbitUpdate={handleOrbitUpdate}
            />

            <div className="absolute right-3 top-3 z-10 max-w-[calc(100%-1.5rem)] border border-[#44392C] bg-[#0A0907]/92 shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur-md sm:right-4 sm:top-4">
              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(
                      (current) => !current,
                    );
                  }}
                  className="flex min-w-24 items-center justify-center gap-2 border-r border-[#44392C] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-stone-200 transition hover:bg-amber-500/10 hover:text-amber-200"
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
                  className="flex w-10 items-center justify-center border-r border-[#44392C] text-stone-400 transition hover:bg-amber-500/10 hover:text-amber-200"
                >
                  <RotateCcw size={14} />
                </button>

                <div className="w-44 px-3 py-1.5">
                  <div className="mb-0.5 flex items-center justify-between">
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

                  <div className="mt-0.5 flex justify-between font-mono text-[8px] text-stone-600">
                    <span>0.2×</span>
                    <span>1.6×</span>
                    <span>3.0×</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 border-l-2 border-amber-400/60 bg-[#0B0907]/75 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                    Target
                  </p>

                  <p className="mt-1 font-mono text-xs text-amber-200">
                    EXO-001
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                    Orbital phase
                  </p>

                  <p className="mt-1 font-mono text-xs text-stone-300">
                    {orbitalPhase.toFixed(3)}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                    Inclination
                  </p>

                  <p className="mt-1 font-mono text-xs text-stone-300">
                    {orbitalInclination.toFixed(0)}°
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                    State
                  </p>

                  <p className="mt-1 font-mono text-xs text-stone-300">
                    {isPaused ? "PAUSED" : "RUNNING"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Mission Controls
              </h2>

              <p className="text-sm text-stone-500">
                Simulation parameters
              </p>
            </div>

            <Sigma
              className="text-rose-300"
              size={22}
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-md border border-[#3A3024] bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Planet Radius
                  </p>

                  <p className="mt-1 font-mono text-2xl text-amber-200">
                    {planetRadius.toFixed(1)} R⊕
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
                step="0.1"
                value={planetRadius}
                onChange={(event) => {
                  setPlanetRadius(
                    Number(event.target.value),
                  );
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

                  <p className="mt-1 font-mono text-2xl text-stone-200">
                    {starRadius.toFixed(1)} R☉
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
                step="0.1"
                value={starRadius}
                onChange={(event) => {
                  setStarRadius(
                    Number(event.target.value),
                  );
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

                  <p className="mt-1 font-mono text-2xl text-amber-200">
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

              <div className="mt-2 flex justify-between font-mono text-[10px] text-stone-600">
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

                  <p className="mt-1 font-mono text-2xl text-stone-200">
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

                  <p className="mt-1 font-mono text-2xl text-rose-300">
                    {effectiveTransitDepthPercent.toFixed(
                      4,
                    )}
                    %
                  </p>
                </div>

                <div
                  className={
                    transitVisibility === 0
                      ? "flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-stone-500"
                      : transitVisibility < 0.999
                        ? "flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-200"
                        : "flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-rose-300"
                  }
                >
                  <span
                    className={
                      transitVisibility === 0
                        ? "size-1.5 bg-stone-600"
                        : transitVisibility < 0.999
                          ? "size-1.5 bg-amber-300"
                          : "size-1.5 bg-rose-300"
                    }
                  />

                  {transitGeometry}
                </div>
              </div>

              <div className="mt-4 border-t border-[#2A2620] pt-3">
                <p className="font-mono text-xs text-stone-500">
                  Maximum depth:{" "}
                  {maximumTransitDepthPercent.toFixed(
                    4,
                  )}
                  %
                </p>

                <p className="mt-1 text-xs text-stone-600">
                  Visible signal after orbital alignment
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-5 max-w-[1500px] rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Database
              className="text-rose-300"
              size={20}
            />

            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Live Light-Curve
              </h2>

              <p className="text-sm text-stone-500">
                Theoretical model and simulated telescope observation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l-2 border-rose-400/70 pl-3 font-mono text-[10px] uppercase tracking-[0.18em] text-rose-300">
            <span className="size-1.5 animate-pulse bg-rose-300" />
            Photometry / live
          </div>
        </div>

        <div className="h-[360px] rounded-md border border-[#2A2620] bg-[#090807] p-4 sm:h-[400px] sm:p-5">
          <LightCurveChart
            orbitalPhase={orbitalPhase}
            transitDepthPercent={
              effectiveTransitDepthPercent
            }
            noisePpm={noisePpm}
          />
        </div>
      </section>
    </main>
  );
}