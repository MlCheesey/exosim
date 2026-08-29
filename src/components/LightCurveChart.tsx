"use client";

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
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type LightCurveChartProps = {
  orbitalPhase: number;
  transitDepthPercent: number;
  noisePpm?: number;
};

function sampleNoise(index: number) {
  const value = ((index + 17) * 9301 + 49297) % 233280;
  return (value / 233280) * 2 - 1;
}

export function LightCurveChart({
  orbitalPhase,
  transitDepthPercent,
  noisePpm = 0,
}: LightCurveChartProps) {
  const sampleCount = 121;
  const phases = Array.from({ length: sampleCount }, (_, i) => i / (sampleCount - 1));
  const noiseAmount = noisePpm / 10000;
  const noiseValues = Array.from({ length: sampleCount }, (_, index) => sampleNoise(index));

  function getBrightness(phase: number) {
    const distance = Math.abs(phase - 0.25);

    if (distance >= 0.075) {
      return 100;
    }

    if (distance <= 0.04) {
      return 100 - transitDepthPercent;
    }

    const t = (0.075 - distance) / (0.075 - 0.04);
    return 100 - transitDepthPercent * (t * t * (3 - 2 * t));
  }

  const model = phases.map((phase) => getBrightness(phase));
  const observed = model.map((value, i) => value + noiseValues[i] * noiseAmount);

  const currentIndex = Math.min(sampleCount - 1, Math.round(orbitalPhase * (sampleCount - 1)));
  const now = Array<number | null>(sampleCount).fill(null);
  now[currentIndex] = observed[currentIndex];

  const inTransit = getBrightness(orbitalPhase) < 100;
  const bottomPad = Math.max(transitDepthPercent * 1.5, noiseAmount * 2.2, 0.012);
  const topPad = Math.max(noiseAmount * 1.3, 0.003);

  const chartData = {
    labels: phases.map((phase) => phase.toFixed(2)),
    datasets: [
      {
        label: "model",
        data: model,
        borderColor: "var(--transit)",
        backgroundColor: "rgba(199, 111, 92, 0.09)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.32,
        fill: true,
      },
      {
        label: "simulated samples",
        data: observed,
        borderColor: "transparent",
        backgroundColor: "var(--sample)",
        pointBackgroundColor: "var(--sample)",
        pointBorderWidth: 0,
        pointRadius: noisePpm > 0 ? 1.7 : 0,
        pointHoverRadius: 4,
        showLine: false,
      },
      {
        label: "now",
        data: now,
        borderColor: "var(--gold)",
        backgroundColor: "var(--gold)",
        pointBorderColor: "var(--background)",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 7,
        showLine: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          color: "var(--muted)",
          boxHeight: 7,
          boxWidth: 7,
          usePointStyle: true,
          filter: (item: { text?: string }) => item.text !== "now",
        },
      },
      tooltip: {
        backgroundColor: "var(--background)",
        borderColor: "var(--line)",
        borderWidth: 1,
        titleColor: "var(--foreground)",
        bodyColor: "var(--gold)",
        callbacks: {
          title: (items: { label?: string }[]) => `phase ${items[0]?.label ?? "0"}`,
          label: (context: { parsed: { y: number | null }; dataset: { label?: string } }) => {
            const value = context.parsed.y;
            return value === null ? "" : `${context.dataset.label}: ${value.toFixed(4)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "var(--chart-grid)" },
        ticks: { color: "var(--muted)", maxTicksLimit: 6 },
        title: { display: true, text: "orbital phase", color: "var(--muted)" },
      },
      y: {
        min: 100 - bottomPad,
        max: 100 + topPad,
        grid: { color: "var(--chart-grid)" },
        ticks: {
          color: "var(--muted)",
          maxTicksLimit: 5,
          callback: (value: string | number) => `${Number(value).toFixed(3)}%`,
        },
        title: { display: true, text: "relative brightness", color: "var(--muted)" },
      },
    },
  } as const;

  function exportRows() {
    const rows = [
      "phase,model_brightness_percent,simulated_brightness_percent,transit_depth_percent,noise_ppm",
      ...phases.map((phase, i) =>
        [
          phase.toFixed(6),
          model[i].toFixed(8),
          observed[i].toFixed(8),
          transitDepthPercent.toFixed(8),
          noisePpm.toFixed(0),
        ].join(","),
      ),
    ];

    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "exosim-light-curve.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="grid grid-cols-2 gap-5 sm:flex sm:gap-8">
          <div>
            <p className="font-mono text-xs text-stone-500">current flux</p>
            <p className="mt-1 font-mono text-lg text-stone-200">
              {observed[currentIndex].toFixed(4)}%
            </p>
          </div>

          <div>
            <p className="font-mono text-xs text-stone-500">noise</p>
            <p className="mt-1 font-mono text-lg text-stone-300">{noisePpm.toFixed(0)} ppm</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className={`font-mono text-xs ${inTransit ? "text-red-300" : "text-amber-200"}`}>
            {inTransit ? "transit in progress" : "baseline"}
          </p>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-md border border-stone-700 bg-stone-950 px-3 text-xs font-medium text-stone-100 hover:border-amber-700 hover:text-amber-200"
            onClick={exportRows}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
