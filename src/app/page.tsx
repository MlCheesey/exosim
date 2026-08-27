"use client";

import { useCallback, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import HowToUse from "@/components/HowToUse";
import ExoSimLogo from "@/components/ExoSimLogo";
import { LightCurveChart } from "@/components/LightCurveChart";
import OrbitalScene from "@/components/OrbitalScene";
import ScienceMath from "@/components/ScienceMath";
import ExoplanetLibrary, { type ExoplanetPreset } from "@/components/PlanetPresetLibrary";
import { calculateTransitVisibility, getTransitGeometry } from "@/lib/transitMath";

type RangeControlProps = {
  label: string;
  value: string;
  currentValue: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  accent?: "amber" | "rose";
  description?: string;
};

function RangeControl({
  label,
  value,
  currentValue,
  min,
  max,
  step,
  onChange,
  accent = "amber",
  description,
}: RangeControlProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-stone-400">{label}</span>
        <span
          className={`font-mono text-lg ${accent === "rose" ? "text-rose-400" : "text-amber-500"}`}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className={`exo-range ${accent === "rose" ? "exo-range--rose" : ""}`}
      />
      {description && <p className="text-xs text-stone-500 mt-2">{description}</p>}
    </div>
  );
}

export default function Home() {
  const [planetRadius, setPlanetRadius] = useState(1);
  const [starRadius, setStarRadius] = useState(1);
  const [orbitalInclination, setOrbitalInclination] = useState(90);
  const [noisePpm, setNoisePpm] = useState(50);
  const [orbitalPhase, setOrbitalPhase] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [resetSignal, setResetSignal] = useState(0);
  const [activePlanetName, setActivePlanetName] = useState<string | undefined>(undefined);

  const solarRadiusInEarthRadii = 109.1;
  const radiusRatio = planetRadius / (starRadius * solarRadiusInEarthRadii);
  const maximumTransitDepthPercent = radiusRatio ** 2 * 100;

  const renderedPlanetRadius = 0.38 * planetRadius;
  const renderedStarRadius = 1.35 * starRadius;
  const inclinationRadians = (orbitalInclination * Math.PI) / 180;
  const projectedTransitOffset = Math.abs(0.12 + 4 * Math.cos(inclinationRadians));

  const transitVisibility = calculateTransitVisibility(
    renderedPlanetRadius,
    renderedStarRadius,
    projectedTransitOffset
  );
  const effectiveTransitDepthPercent = maximumTransitDepthPercent * transitVisibility;
  const transitGeometry = getTransitGeometry(transitVisibility);

  const handleOrbitUpdate = useCallback((phase: number) => {
    setOrbitalPhase(phase);
  }, []);

  const handleReset = useCallback(() => {
    setResetSignal((current) => current + 1);
    setOrbitalPhase(0);
  }, []);

  const handleLoadPreset = useCallback(
    (preset: ExoplanetPreset) => {
      setPlanetRadius(preset.planetRadius);
      setStarRadius(preset.starRadius);
      setOrbitalInclination(90);
      setActivePlanetName(preset.name);
      setIsPaused(false);
      handleReset();
      window.location.hash = "lab";
    },
    [handleReset]
  );

  return (
    <main className="min-h-screen bg-stone-950 text-stone-200 overflow-x-hidden font-sans">
      <header className="border-b border-stone-800 p-4 sticky top-0 bg-stone-950/90 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ExoSimLogo className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-50">ExoSim</h1>
              <span className="text-xs text-amber-500 font-mono uppercase tracking-widest">
                Transit Lab
              </span>
            </div>
          </div>
        </div>
      </header>

      <HowToUse />

      <section id="lab" className="max-w-7xl mx-auto flex flex-col lg:flex-row border-b border-stone-800">
        <div className="lg:w-3/4 p-4 sm:p-6 lg:border-r border-stone-800 border-b lg:border-b-0">
          <h2 className="text-xl font-semibold mb-4 text-stone-50">Simulator View</h2>

          <div className="relative bg-black rounded-lg overflow-hidden border border-stone-800 h-[500px] sm:h-[600px] lg:h-[70vh]">
            <OrbitalScene
              planetRadius={planetRadius}
              starRadius={starRadius}
              planetName={activePlanetName}
              orbitalInclination={orbitalInclination}
              isPaused={isPaused}
              simulationSpeed={simulationSpeed}
              resetSignal={resetSignal}
              onOrbitUpdate={handleOrbitUpdate}
            />

            <div className="absolute top-4 right-4 bg-black/80 border border-stone-700 rounded-md p-2 flex gap-2 backdrop-blur-md shadow-lg">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="exo-button px-4 py-2"
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset orbit"
                className="exo-icon-button"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 bg-black/80 border-l-2 border-amber-500 p-4 flex gap-6 rounded-r-md backdrop-blur-md">
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">Phase</p>
                <p className="font-mono text-sm text-stone-200">{orbitalPhase.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">Speed</p>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  aria-label="Orbit speed"
                  className="exo-range w-24 mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:w-1/4 p-4 sm:p-6 bg-stone-900/50">
          <h3 className="font-semibold mb-6 text-stone-50 text-lg">System Parameters</h3>

          <RangeControl
            label="Planet Radius (R⊕)"
            value={planetRadius.toFixed(2)}
            currentValue={planetRadius}
            min={0.5}
            max={2.5}
            step={0.01}
            onChange={(val) => {
              setPlanetRadius(val);
              setActivePlanetName(undefined);
            }}
          />

          <RangeControl
            label="Star Radius (R☉)"
            value={starRadius.toFixed(2)}
            currentValue={starRadius}
            min={0.2}
            max={2.0}
            step={0.01}
            onChange={(val) => {
              setStarRadius(val);
              setActivePlanetName(undefined);
            }}
          />

          <RangeControl
            label="Inclination (°)"
            value={orbitalInclination.toString()}
            currentValue={orbitalInclination}
            min={60}
            max={90}
            step={1}
            onChange={setOrbitalInclination}
            description="Orbital plane angle relative to the observer."
          />

          <div className="mt-8 pt-6 border-t border-stone-800">
            <RangeControl
              label="Sensor Noise (ppm)"
              value={noisePpm.toString()}
              currentValue={noisePpm}
              min={0}
              max={200}
              step={5}
              onChange={setNoisePpm}
              accent="rose"
            />
          </div>
        </aside>
      </section>

      <section className="max-w-7xl mx-auto p-4 sm:p-6 my-8">
        <h2 className="text-xl font-semibold mb-4 text-stone-50">Light Curve Data</h2>
        <div className="h-[350px] sm:h-[450px] bg-stone-900/30 border border-stone-800 rounded-lg p-2 sm:p-4">
          <LightCurveChart
            orbitalPhase={orbitalPhase}
            transitDepthPercent={effectiveTransitDepthPercent}
            noisePpm={noisePpm}
          />
        </div>
      </section>

      <ExoplanetLibrary activePlanetName={activePlanetName} onLoadPreset={handleLoadPreset} />

      <ScienceMath
        planetRadius={planetRadius}
        starRadius={starRadius}
        orbitalInclination={orbitalInclination}
        radiusRatio={radiusRatio}
        maximumTransitDepthPercent={maximumTransitDepthPercent}
        effectiveTransitDepthPercent={effectiveTransitDepthPercent}
        transitGeometry={transitGeometry}
      />
    </main>
  );
}
