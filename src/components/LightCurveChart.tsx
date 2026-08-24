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

  function handleExportCsv() {
    const header = [
      "orbital_phase",
      "theoretical_brightness_percent",
      "simulated_observation_percent",
      "transit_depth_percent",
      "noise_ppm",
    ].join(",");

    const rows = phases.map(
      (phase, index) => {
        return [
          phase.toFixed(6),
          theoreticalBrightness[
            index
          ].toFixed(8),
          observedBrightness[
            index
          ].toFixed(8),
          transitDepthPercent.toFixed(8),
          noisePpm.toFixed(0),
        ].join(",");
      },
    );

    const csvContent = [
      header,
      ...rows,
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8",
      },
    );

    const downloadUrl =
      URL.createObjectURL(blob);

    const downloadLink =
      document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download =
      "exosim-light-curve.csv";

    document.body.appendChild(
      downloadLink,
    );

    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(downloadUrl);
  }

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
          borderColor: "#EF8E93",
          backgroundColor:
            "rgba(239, 142, 147, 0.07)",
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
            "rgba(223, 196, 151, 0.62)",
          pointBackgroundColor:
            "rgba(223, 196, 151, 0.62)",
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
          borderColor: "#F7D493",
          backgroundColor: "#F7D493",
          pointBorderColor: "#6D352E",
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
              color: "#716D66",
              usePointStyle: true,
              pointStyle: "rect",
              boxWidth: 6,
              boxHeight: 6,
              padding: 18,
              font: {
                family:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
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
            backgroundColor: "#070809",
            borderColor:
              "rgba(245, 181, 76, 0.28)",
            borderWidth: 1,
            titleColor: "#D6D3D1",
            bodyColor: "#F7D493",
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
                "rgba(255, 255, 255, 0.045)",
            },
            border: {
              color:
                "rgba(255, 255, 255, 0.10)",
            },
            ticks: {
              color: "#69655F",
              maxTicksLimit: 6,
              font: {
                family:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                size: 10,
              },
            },
            title: {
              display: true,
              text: "ORBITAL PHASE",
              color: "#69655F",
              font: {
                family:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
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
                "rgba(255, 255, 255, 0.05)",
            },
            border: {
              color:
                "rgba(255, 255, 255, 0.10)",
            },
            ticks: {
              color: "#69655F",
              maxTicksLimit: 5,
              font: {
                family:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
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
              color: "#69655F",
              font: {
                family:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
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
      <div className="mb-4 grid grid-cols-2 gap-x-5 gap-y-3 sm:flex sm:items-start sm:justify-between sm:gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-5 sm:flex sm:items-start sm:gap-10">
          <div className="min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-stone-700">
              Observed flux
            </p>
            <p className="mt-1 font-mono text-lg text-stone-200 sm:text-xl">
              {currentObservedBrightness.toFixed(4)}%
            </p>
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-stone-700">
              Noise floor
            </p>
            <p className="mt-1 font-mono text-sm text-stone-400">
              {noisePpm.toFixed(0)} ppm
            </p>
          </div>
        </div>

        <div className="col-span-2 flex items-start gap-3 justify-self-start sm:col-span-1 sm:justify-self-auto">
          <div
            className={`min-h-[38px] min-w-[150px] border-l pl-4 ${
              isTransiting
                ? "border-rose-300/60"
                : "border-amber-300/50"
            }`}
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-stone-700">
              Detection state
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span
                className={
                  isTransiting
                    ? "size-1.5 shrink-0 rounded-full bg-rose-300 shadow-[0_0_10px_rgba(239,142,147,0.5)]"
                    : "size-1.5 shrink-0 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(245,181,76,0.45)]"
                }
              />
              <p
                className={
                  isTransiting
                    ? "whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-rose-300"
                    : "whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-amber-200"
                }
              >
                {isTransiting
                  ? "Transit detected"
                  : "Baseline stable"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="exo-button min-h-[38px] whitespace-nowrap px-3 text-[9px]"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <Line
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
}