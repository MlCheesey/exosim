"use client";

import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

type LightCurveChartProps = {
  orbitalPhase: number;
  transitDepthPercent: number;
};

function calculateBrightness(
  phase: number,
  transitDepthPercent: number,
) {
  const transitCenter = 0.25;
  const fullTransitDistance = 0.04;
  const outerTransitDistance = 0.075;

  const distanceFromTransit = Math.abs(
    phase - transitCenter,
  );

  if (distanceFromTransit >= outerTransitDistance) {
    return 100;
  }

  if (distanceFromTransit <= fullTransitDistance) {
    return 100 - transitDepthPercent;
  }

  const ingressProgress =
    (outerTransitDistance - distanceFromTransit) /
    (outerTransitDistance - fullTransitDistance);

  const smoothProgress =
    ingressProgress *
    ingressProgress *
    (3 - 2 * ingressProgress);

  return 100 - transitDepthPercent * smoothProgress;
}

export function LightCurveChart({
  orbitalPhase,
  transitDepthPercent,
}: LightCurveChartProps) {
  const sampleCount = 121;

  const phases = useMemo(() => {
    return Array.from(
      { length: sampleCount },
      (_, index) => index / (sampleCount - 1),
    );
  }, []);

  const brightnessValues = useMemo(() => {
    return phases.map((phase) => {
      return calculateBrightness(
        phase,
        transitDepthPercent,
      );
    });
  }, [phases, transitDepthPercent]);

  const currentBrightness = calculateBrightness(
    orbitalPhase,
    transitDepthPercent,
  );

  const currentPointIndex = Math.min(
    sampleCount - 1,
    Math.round(orbitalPhase * (sampleCount - 1)),
  );

  const chartData = useMemo<
    ChartData<"line", (number | null)[], string>
  >(() => {
    const currentPointData = Array<number | null>(
      sampleCount,
    ).fill(null);

    currentPointData[currentPointIndex] =
      brightnessValues[currentPointIndex];

    return {
      labels: phases.map((phase) => phase.toFixed(2)),
      datasets: [
        {
          label: "Expected brightness",
          data: brightnessValues,
          borderColor: "#E08B78",
          backgroundColor: "rgba(190, 85, 65, 0.14)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: true,
        },
        {
          label: "Current observation",
          data: currentPointData,
          borderColor: "#F3C58F",
          backgroundColor: "#F3C58F",
          pointBorderColor: "#7A3F33",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 7,
          showLine: false,
        },
      ],
    };
  }, [
    brightnessValues,
    currentPointIndex,
    phases,
  ]);

  const chartMinimum = Math.max(
    0,
    100 - Math.max(transitDepthPercent * 1.35, 0.01),
  );

  const chartOptions = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 160,
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#15120F",
          borderColor: "#4A3A2E",
          borderWidth: 1,
          titleColor: "#D6D3D1",
          bodyColor: "#F3C58F",
          displayColors: false,
          callbacks: {
            title(items) {
              const phase = items[0]?.label ?? "0";
              return `Orbital phase: ${phase}`;
            },
            label(context) {
              const value = context.parsed.y;

              if (value === null) {
                return "";
              }

              return `Brightness: ${value.toFixed(4)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(120, 102, 82, 0.10)",
          },
          border: {
            color: "rgba(120, 102, 82, 0.35)",
          },
          ticks: {
            color: "#78716C",
            maxTicksLimit: 6,
            font: {
              family: "monospace",
              size: 10,
            },
          },
          title: {
            display: true,
            text: "ORBITAL PHASE",
            color: "#78716C",
            font: {
              family: "monospace",
              size: 10,
            },
          },
        },
        y: {
          min: chartMinimum,
          max: 100.002,
          grid: {
            color: "rgba(120, 102, 82, 0.12)",
          },
          border: {
            color: "rgba(120, 102, 82, 0.35)",
          },
          ticks: {
            color: "#78716C",
            maxTicksLimit: 5,
            font: {
              family: "monospace",
              size: 10,
            },
            callback(value) {
              return `${Number(value).toFixed(3)}%`;
            },
          },
          title: {
            display: true,
            text: "RELATIVE BRIGHTNESS",
            color: "#78716C",
            font: {
              family: "monospace",
              size: 10,
            },
          },
        },
      },
    }),
    [chartMinimum],
  );

  const isTransiting = currentBrightness < 100;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600">
            Current relative flux
          </p>
          <p className="mt-1 font-mono text-xl text-stone-200">
            {currentBrightness.toFixed(4)}%
          </p>        </div>
        <div          className={
            isTransiting
              ? "rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-rose-300"
              : "rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200"
        }
        >
          {isTransiting
            ? "Transit detected"
            : "Baseline stable"}
        </div>      </div>
      <div className="min-h-0 flex-1">
        <Line          data={chartData}
          options={chartOptions}
        />
      </div>    </div>  );
}