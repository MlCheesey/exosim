"use client";

import type { ReactNode } from "react";
import {
  useCallback,
  useState,
} from "react";
import {
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import ExoSimLogo from "@/components/ExoSimLogo";
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

type RangeControlProps = {
  index: string;
  label: string;
  value: ReactNode;
  valueColor?: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  onChange: (value: number) => void;
  labels: string[];
  accent?: "amber" | "rose";
  description?: string;
};

function RangeControl({
  index,
  label,
  value,
  valueColor = "text-stone-100",
  min,
  max,
  step,
  currentValue,
  onChange,
  labels,
  accent = "amber",
  description,
}: RangeControlProps) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-stone-500">
            {label}
          </p>

          <p
            className={`mt-1 font-mono text-xl sm:text-2xl ${valueColor}`}
          >
            {value}
          </p>
        </div>

        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-stone-700">
          {index}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(event) => {
          onChange(Number(event.target.value));
        }}
        aria-label={label}
        className={`mt-4 exo-range ${
          accent === "rose"
            ? "exo-range--rose"
            : ""
        }`}
      />

      <div
        className={`mt-1 grid font-mono text-[9px] text-stone-700 ${
          labels.length === 3
            ? "grid-cols-3"
            : "grid-cols-2"
        }`}
      >
        {labels.map((rangeLabel, labelIndex) => (
          <span
            key={rangeLabel}
            className={
              labelIndex === 0
                ? "text-left"
                : labelIndex === labels.length - 1
                  ? "text-right"
                  : "text-center"
            }
          >
            {rangeLabel}
          </span>
        ))}
      </div>

      {description ? (
        <p className="mt-3 border-l border-white/10 pl-3 text-[11px] leading-5 text-stone-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  status,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  status?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-amber-300/70">
          {number}
        </span>

        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-stone-600">
            {eyebrow}
          </p>

          <h2 className="mt-1 font-display text-xl font-medium tracking-[-0.025em] text-stone-50 sm:text-2xl">
            {title}
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-stone-500 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      {status}
    </div>
  );
}

export default function Home() {
  const [planetRadius, setPlanetRadius] =
    useState(1);
  const [starRadius, setStarRadius] =
    useState(1);
  const [orbitalInclination, setOrbitalInclination] =
    useState(90);
  const [noisePpm, setNoisePpm] =
    useState(50);
  const [orbitalPhase, setOrbitalPhase] =
    useState(0);
  const [isPaused, setIsPaused] =
    useState(false);
  const [simulationSpeed, setSimulationSpeed] =
    useState(1);
  const [resetSignal, setResetSignal] =
    useState(0);
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
    getTransitGeometry(transitVisibility);

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
    <main className="min-h-screen overflow-x-hidden text-stone-100">
      <header className="border-b border-white/[0.08] bg-[#030405]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a
            href="#lab"
            className="group flex min-w-0 items-center gap-3"
            aria-label="ExoSim home"
          >
            <ExoSimLogo className="size-11 shrink-0 transition-transform duration-300 group-hover:scale-[1.04] sm:size-12" />

            <div className="min-w-0">
              <h1 className="font-display text-xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-2xl">
                ExoSim
              </h1>

              <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-amber-200/60 sm:text-[9px]">
                Exoplanet Transit Lab
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-xs font-medium text-stone-500 md:flex">
            <a
              href="#lab"
              className="transition hover:text-stone-100"
            >
              Simulator
            </a>

            <a
              href="#library"
              className="transition hover:text-stone-100"
            >
              Planet Library
            </a>

            <a
              href="#science"
              className="transition hover:text-stone-100"
            >
              Science
            </a>
          </nav>

          <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-amber-200/80 sm:text-[9px]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-300 opacity-25" />
              <span className="relative inline-flex size-2 rounded-full bg-amber-300" />
            </span>
            Live system
          </div>

          <nav className="order-3 grid w-full grid-cols-3 border-t border-white/[0.07] pt-3 text-center text-[10px] font-medium text-stone-600 md:hidden">
            <a
              href="#lab"
              className="border-r border-white/[0.07] py-1 hover:text-stone-100"
            >
              Simulator
            </a>
            <a
              href="#library"
              className="border-r border-white/[0.07] py-1 hover:text-stone-100"
            >
              Library
            </a>
            <a
              href="#science"
              className="py-1 hover:text-stone-100"
            >
              Science
            </a>
          </nav>
        </div>
      </header>

      <section
        id="lab"
        className="mx-auto grid w-full max-w-[1500px] border-b border-white/[0.08] lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="min-w-0 px-3 py-6 sm:px-6 sm:py-8 lg:border-r lg:border-white/[0.08]">
          <SectionHeading
            number="01"
            eyebrow="Observation deck"
            title="Orbital view"
            description="Watch the system from a live station window as the planet crosses the stellar disk."
            status={
              <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-stone-600 sm:flex">
                <span className="h-px w-6 bg-amber-300/50" />
                Visual feed 01
              </div>
            }
          />

          <div className="relative mt-5 h-[500px] min-w-0 overflow-hidden border border-white/[0.1] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:h-[560px] lg:h-auto lg:aspect-[16/10]">
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

            <div className="absolute left-3 right-3 top-3 z-10 border border-white/[0.12] bg-black/65 shadow-[0_16px_45px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:left-auto sm:right-5 sm:top-5">
              <div className="grid grid-cols-[minmax(0,1fr)_44px] sm:flex sm:items-stretch">
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(
                      (current) => !current,
                    );
                  }}
                  className="exo-button min-w-0 border-0 border-r border-white/[0.1] px-4 sm:min-w-28"
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
                  className="exo-icon-button border-0"
                >
                  <RotateCcw size={14} />
                </button>

                <div className="col-span-2 w-full border-t border-white/[0.1] px-4 py-2 sm:col-span-1 sm:w-48 sm:border-l sm:border-t-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-stone-600">
                      Orbit speed
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
                    className="mt-1 exo-range"
                  />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 border-l border-amber-300/60 bg-gradient-to-r from-black/80 via-black/55 to-transparent px-4 py-3 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:right-auto">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:gap-7">
                {[
                  {
                    label: "Target",
                    value:
                      activePlanetName ?? "EXO-001",
                    color: "text-amber-200",
                  },
                  {
                    label: "Phase",
                    value: orbitalPhase.toFixed(3),
                    color: "text-stone-200",
                  },
                  {
                    label: "Inclination",
                    value: `${orbitalInclination.toFixed(0)}°`,
                    color: "text-stone-200",
                  },
                  {
                    label: "State",
                    value: isPaused
                      ? "PAUSED"
                      : "RUNNING",
                    color: "text-stone-200",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-w-0"
                  >
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-stone-600">
                      {item.label}
                    </p>
                    <p
                      className={`mt-1 truncate font-mono text-[10px] sm:text-xs ${item.color}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="min-w-0 border-t border-white/[0.08] px-4 py-6 sm:px-6 sm:py-8 lg:border-t-0">
          <SectionHeading
            number="02"
            eyebrow="Flight console"
            title="Mission controls"
            description="Tune the physical system and observation conditions."
          />

          <div className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            <RangeControl
              index="INPUT 01"
              label="Planet radius"
              value={`${planetRadius.toFixed(2)} R⊕`}
              valueColor="text-amber-200"
              min={0.5}
              max={2}
              step={0.01}
              currentValue={planetRadius}
              onChange={(value) => {
                setPlanetRadius(value);
                setActivePlanetName(undefined);
              }}
              labels={["0.5 R⊕", "2.0 R⊕"]}
            />

            <RangeControl
              index="INPUT 02"
              label="Star radius"
              value={`${starRadius.toFixed(2)} R☉`}
              min={0.5}
              max={1.5}
              step={0.01}
              currentValue={starRadius}
              onChange={(value) => {
                setStarRadius(value);
                setActivePlanetName(undefined);
              }}
              labels={["0.5 R☉", "1.5 R☉"]}
            />

            <RangeControl
              index="INPUT 03"
              label="Orbit inclination"
              value={`${orbitalInclination.toFixed(0)}°`}
              valueColor="text-amber-200"
              min={60}
              max={90}
              step={1}
              currentValue={orbitalInclination}
              onChange={setOrbitalInclination}
              labels={[
                "60° tilted",
                "75°",
                "90° edge-on",
              ]}
              description="Lower angles move the planet above or below the stellar disk."
            />

            <RangeControl
              index="INPUT 04"
              label="Observation noise"
              value={`${noisePpm.toFixed(0)} ppm`}
              min={0}
              max={300}
              step={10}
              currentValue={noisePpm}
              onChange={setNoisePpm}
              labels={[
                "0 ppm",
                "150 ppm",
                "300 ppm",
              ]}
              accent="rose"
            />
          </div>

          <div className="mt-6 border-l border-rose-300/55 pl-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-wide text-stone-500">
                  Transit signal
                </p>
                <p className="mt-1 font-mono text-2xl text-rose-300">
                  {effectiveTransitDepthPercent.toFixed(4)}%
                </p>
              </div>

              <div
                className={
                  transitGeometry === "No transit"
                    ? "font-mono text-[8px] uppercase tracking-[0.16em] text-stone-600"
                    : transitGeometry === "Grazing"
                      ? "font-mono text-[8px] uppercase tracking-[0.16em] text-amber-200"
                      : "font-mono text-[8px] uppercase tracking-[0.16em] text-rose-300"
                }
              >
                {transitGeometry}
              </div>
            </div>

            <p className="mt-3 font-mono text-[10px] text-stone-600">
              Maximum · {maximumTransitDepthPercent.toFixed(4)}%
            </p>
            <p className="mt-1 text-[11px] leading-5 text-stone-600">
              Visible signal after exact disk-overlap calculation.
            </p>
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-[1500px] border-b border-white/[0.08] px-3 py-8 sm:px-6 sm:py-10">
        <SectionHeading
          number="03"
          eyebrow="Photometry stream"
          title="Live light curve"
          description="The theoretical model and simulated telescope measurements remain synchronized with the orbit."
          status={
            <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-rose-300 sm:text-[9px]">
              <span className="size-1.5 animate-pulse rounded-full bg-rose-300" />
              Receiving
            </div>
          }
        />

        <div className="mt-6 h-[340px] min-w-0 border-y border-white/[0.08] py-4 sm:h-[410px] sm:py-6">
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
        radiusRatio={planetToStarRadiusRatio}
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