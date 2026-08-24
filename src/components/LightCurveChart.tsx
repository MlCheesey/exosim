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
import type {
  ChartData,
  ChartOptions,
} from "chart.js";
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
  noisePpm?: number;
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

  if (
    distanceFromTransit >=
    outerTransitDistance
  ) {
    return 100;
  }

  if (
    distanceFromTransit <=
    fullTransitDistance
  ) {
    return 100 - transitDepthPercent;
  }

  const ingressProgress =
    (outerTransitDistance -
      distanceFromTransit) /
    (outerTransitDistance -
      fullTransitDistance);

  const smoothProgress =
    ingressProgress *
    ingressProgress *
    (3 - 2 * ingressProgress);

  return (
    100 -
    transitDepthPercent * smoothProgress
  );
}

function createDeterministicNoise(
  sampleIndex: number,
) {
  const generatedValue =
    Math.sin(
      (sampleIndex + 1) * 12.9898,
    ) * 43758.5453;

  const fractionalPart =
    generatedValue -
    Math.floor(generatedValue);

  return fractionalPart * 2 - 1;
}

export function LightCurveChart({
  orbitalPhase,
  transitDepthPercent,
  noisePpm = 0,
}: LightCurveChartProps) {
  const sampleCount = 121;

  const phases = useMemo(() => {
    return Array.from(
      { length: sampleCount },
      (_, index) =>
        index / (sampleCount - 1),
    );
  }, []);

  const theoreticalBrightness =
    useMemo(() => {
      return phases.map((phase) => {
        return calculateBrightness(
          phase,
          transitDepthPercent,
        );
      });
    }, [phases, transitDepthPercent]);

  const noiseAmplitudePercent =
    noisePpm / 10000;

  const observedBrightness = useMemo(() => {
    return theoreticalBrightness.map(
      (brightness, index) => {
        const noise =
          createDeterministicNoise(index) *
          noiseAmplitudePercent;

        return brightness + noise;
      },
    );
  }, [
    theoreticalBrightness,
    noiseAmplitudePercent,
  ]);

  const currentPointIndex = Math.min(
    sampleCount - 1,
    Math.round(
      orbitalPhase * (sampleCount - 1),
    ),
  );

  const currentObservedBrightness =
    observedBrightness[currentPointIndex];

  const currentTheoreticalBrightness =
    calculateBrightness(
      orbitalPhase,
      transitDepthPercent,
    );

  const isTransiting =
    currentTheoreticalBrightness < 100;

  const chartData = useMemo<
    ChartData<
      "line",
      (number | null)[],
      string
    >
  >(() => {
    const currentPointData =
      Array<number | null>(
        sampleCount,
      ).fill(null);

    currentPointData[currentPointIndex] =
      observedBrightness[
        currentPointIndex
      ];

    return {
      labels: phases.map((phase) =>
        phase.toFixed(2),
      ),
      datasets: [
        {
          label: "Theoretical curve",
          data: theoreticalBrightness,
          borderColor: "#E08B78",
          backgroundColor:
            "rgba(190, 85, 65, 0.10)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: true,
          order: 2,
        },
        {
          label: "Simulated observation",
          data: observedBrightness,
          borderColor: "transparent",
          backgroundColor:
            "rgba(214, 184, 145, 0.65)",
          pointBackgroundColor:
            "rgba(214, 184, 145, 0.65)",
          pointBorderWidth: 0,
          pointRadius:
            noisePpm > 0 ? 1.8 : 0,
          pointHoverRadius: 4,
          showLine: false,
          order: 1,
        },
        {
          label: "Current measurement",
          data: currentPointData,
          borderColor: "#F3C58F",
          backgroundColor: "#F3C58F",
          pointBorderColor: "#7A3F33",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 7,
          showLine: false,
          order: 0,
        },
      ],
    };
  }, [
    currentPointIndex,
    noisePpm,
    observedBrightness,
    phases,
    theoreticalBrightness,
  ]);

  const lowerChartExcursion = Math.max(
    transitDepthPercent * 1.4,
    noiseAmplitudePercent * 2.2,
    0.01,
  );

  const upperChartExcursion = Math.max(
    noiseAmplitudePercent * 1.4,
    0.002,
  );

  const chartOptions =
    useMemo<ChartOptions<"line">>(
      () => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            align: "start",
            labels: {
              color: "#78716C",
              usePointStyle: true,
              pointStyle: "rect",
              boxWidth: 6,
              boxHeight: 6,
              padding: 18,
              font: {
                family: "monospace",
                size: 9,
              },
              filter(item) {
                return (
                  item.text !==
                  "Current measurement"
                );
              },
            },
          },
          tooltip: {
            backgroundColor: "#15120F",
            borderColor: "#4A3A2E",
            borderWidth: 1,
            titleColor: "#D6D3D1",
            bodyColor: "#F3C58F",
            displayColors: true,
            callbacks: {
              title(items) {
                const phase =
                  items[0]?.label ?? "0";

                return `Orbital phase: ${phase}`;
              },
              label(context) {
                const value =
                  context.parsed.y;

                if (value === null) {
                  return "";
                }

                return `${context.dataset.label}: ${value.toFixed(4)}%`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color:
                "rgba(120, 102, 82, 0.10)",
            },
            border: {
              color:
                "rgba(120, 102, 82, 0.35)",
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
            min:
              100 -
              lowerChartExcursion,
            max:
              100 +
              upperChartExcursion,
            grid: {
              color:
                "rgba(120, 102, 82, 0.12)",
            },
            border: {
              color:
                "rgba(120, 102, 82, 0.35)",
            },
            ticks: {
              color: "#78716C",
              maxTicksLimit: 5,
              font: {
                family: "monospace",
                size: 10,
              },
              callback(value) {
                return `${Number(
                  value,
                ).toFixed(3)}%`;
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
      [
        lowerChartExcursion,
        upperChartExcursion,
      ],
    );

  return (
    <div className="flex h-full w-full flex-col">
<div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:items-start sm:justify-between sm:gap-4">
  <div className="col-span-2 grid grid-cols-2 gap-4 sm:flex sm:items-start sm:gap-8">
    <div className="min-w-0">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
        Observed flux
      </p>

      <p className="mt-1 font-mono text-xl text-stone-200">
        {currentObservedBrightness.toFixed(4)}%
      </p>
    </div>

    <div className="min-w-0">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
        Noise floor
      </p>

      <p className="mt-1 font-mono text-sm text-stone-400">
        {noisePpm.toFixed(0)} ppm
      </p>
    </div>
  </div>

  <div
    className={`col-span-2 min-h-[38px] min-w-[150px] justify-self-start border-l-2 pl-3 sm:col-span-1 sm:justify-self-auto ${
      isTransiting
        ? "border-rose-400"
        : "border-amber-400/60"
    }`}
  >
    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
      Detection state
    </p>

    <div className="mt-1 flex items-center gap-2">
      <span
        className={
          isTransiting
            ? "size-1.5 shrink-0 bg-rose-300"
            : "size-1.5 shrink-0 bg-amber-300"
        }
      />

      <p
        className={
          isTransiting
            ? "whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-rose-300"
            : "whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-amber-200"
        }
      >
        {isTransiting
          ? "Transit detected"
          : "Baseline stable"}
      </p>
    </div>
  </div>
</div>
      <div className="min-h-0 flex-1">
        <Line          data={chartData}
          options={chartOptions}
        />
      </div>    </div>  );
}