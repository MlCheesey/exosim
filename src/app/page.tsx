"use client";

import { useCallback, useState } from "react";
import {
  Activity,
  Database,
  Orbit,
  Sigma,
} from "lucide-react";
import { LightCurveChart } from "@/components/LightCurveChart";
import OrbitalScene from "@/components/OrbitalScene";

export default function Home() {
  const [planetRadius, setPlanetRadius] = useState(1);
  const [starRadius, setStarRadius] = useState(1);
  const [orbitalPhase, setOrbitalPhase] = useState(0);

  const solarRadiusInEarthRadii = 109.1;

  const planetToStarRadiusRatio =
    planetRadius /
    (starRadius * solarRadiusInEarthRadii);

  const transitDepthPercent =
    planetToStarRadiusRatio ** 2 * 100;

  const handleOrbitUpdate = useCallback(
    (phase: number) => {
      setOrbitalPhase(phase);
    },
    [],
  );

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-5 text-stone-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-[#2A2620] bg-[#11100E]/90 px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-300">
            <Orbit size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-50">
              ExoSim
            </h1>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Exoplanet Transit Lab
            </p>          </div>        </div>
        <nav className="hidden items-center gap-6 text-sm text-stone-400 md:flex">
          <a            href="#lab"
            className="transition hover:text-amber-300"
          >
            Lab
          </a>
          <a            href="#library"
            className="transition hover:text-amber-300"
          >
            NASA Library
          </a>
          <a            href="#science"
            className="transition hover:text-amber-300"
          >
            Science Math
          </a>        </nav>
        <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
          <Activity size={14} />
          TELEMETRY ACTIVE
        </div>      </header>
      <section        id="lab"
        className="mx-auto mt-6 grid max-w-7xl gap-5 lg:grid-cols-[1fr_340px]"
      >
        <div className="rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Orbital View
              </h2>
              <p className="text-sm text-stone-500">
                Live 3D view of the star and orbiting exoplanet.
              </p>            </div>
            <Orbit              className="text-amber-300"
              size={22}
            />
          </div>
          <div className="relative h-[360px] overflow-hidden rounded-lg border border-[#2A2620] bg-[#050505] sm:h-[440px] lg:h-auto lg:aspect-video">
            <OrbitalScene              planetRadius={planetRadius}
              starRadius={starRadius}
              onOrbitUpdate={handleOrbitUpdate}
            />

            <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-[#3A3024] bg-[#0B0907]/80 px-3 py-2 backdrop-blur-sm">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
                Target system
              </p>
              <p className="mt-1 font-mono text-xs text-amber-200">
                EXO-001
              </p>            </div>          </div>        </div>
        <aside className="rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Mission Controls
              </h2>
              <p className="text-sm text-stone-500">
                Simulation parameters
              </p>            </div>
            <Sigma              className="text-rose-300"
              size={22}
            />
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-[#3A3024] bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Planet Radius
                  </p>
                  <p className="mt-1 font-mono text-2xl text-amber-200">
                    {planetRadius.toFixed(1)} R
                  </p>                </div>
                <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300">
                  Interactive
                </span>              </div>
              <input                type="range"
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
                <span>0.5 R</span>                <span>2.0 R</span>              </div>            </div>
            <div className="rounded-lg border border-[#3A3024] bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Star Radius
                  </p>
                  <p className="mt-1 font-mono text-2xl text-stone-200">
                    {starRadius.toFixed(1)} R
                  </p>                </div>
                <span className="rounded-full border border-stone-500/20 bg-stone-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-stone-300">
                  Interactive
                </span>              </div>
              <input                type="range"
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
                <span>0.5 R</span>                <span>1.5 R</span>              </div>            </div>
            <div className="rounded-lg border border-rose-500/20 bg-[#090807] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">
                    Transit Depth
                  </p>
                  <p className="mt-1 font-mono text-2xl text-rose-300">
                    {transitDepthPercent.toFixed(4)}%
                  </p>                </div>
                <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-rose-300">
                  Live
                </span>              </div>
              <div className="mt-4 border-t border-[#2A2620] pt-3">
                <p className="font-mono text-xs text-stone-500">
                  F / F = (R / R)
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  Expected brightness blocked during transit
                </p>              </div>            </div>          </div>        </aside>      </section>
      <section className="mx-auto mt-5 max-w-7xl rounded-lg border border-[#2A2620] bg-[#11100E]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Database              className="text-rose-300"
              size={20}
            />

            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Live Light-Curve
              </h2>
              <p className="text-sm text-stone-500">
                Normalized stellar brightness across one orbit
              </p>            </div>          </div>
          <div className="flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-rose-300">
            <span className="size-1.5 animate-pulse rounded-full bg-rose-300" />
            Photometry live
          </div>        </div>
        <div className="h-[320px] rounded-lg border border-[#2A2620] bg-[#090807] p-4 sm:h-[360px] sm:p-5">
          <LightCurveChart            orbitalPhase={orbitalPhase}
            transitDepthPercent={transitDepthPercent}
          />
        </div>      </section>    </main>  );
}