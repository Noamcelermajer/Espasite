"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

import type { Un2720ApiPayload } from "@/lib/un2720";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Un2720ChartsClientProps {
  apiPayloads?: Un2720ApiPayload[];
}

export function Un2720ChartsClient({ apiPayloads }: Un2720ChartsClientProps) {
  const apiBody = apiPayloads?.[0]?.body as
    | {
        categoryPieLabels?: string[];
        categoryPieData?: number[];
        barLabels?: string[];
        barPallets?: number[];
        barTrucks?: number[];
        barWeights?: number[];
        departingLabels?: string[];
        stackedDatasets?: { label: string; data: number[]; backgroundColor?: string }[];
        orgLabels?: string[];
        orgTruckCounts?: number[];
        orgPalletCounts?: number[];
      }
    | undefined;

  const commodityPie = useMemo(() => {
    if (!apiBody?.categoryPieLabels || !apiBody?.categoryPieData) return null;
    return {
      data: {
        labels: apiBody.categoryPieLabels,
        datasets: [
          {
            data: apiBody.categoryPieData,
            backgroundColor: [
              "#0077b6",
              "#00b4d8",
              "#48cae4",
              "#0096c7",
              "#ade8f4",
              "#03045e",
              "#caf0f8",
              "#1d4ed8",
              "#0ea5e9",
              "#14b8a6",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "left" as const,
            labels: { boxWidth: 18, font: { size: 10 } },
          },
        },
      },
    };
  }, [apiBody]);

  const dailyTrends = useMemo(() => {
    if (!apiBody?.barLabels) return null;
    return {
      data: {
        labels: apiBody.barLabels,
        datasets: [
          {
            type: "line" as const,
            label: "Pallets",
            data: apiBody.barPallets ?? [],
            borderColor: "#f59e0b",
            backgroundColor: "#f59e0b",
            borderWidth: 2,
            tension: 0.1,
            yAxisID: "y1",
            pointRadius: 0,
          },
          {
            type: "line" as const,
            label: "Trucks",
            data: apiBody.barTrucks ?? [],
            borderColor: "#ef4444",
            backgroundColor: "#ef4444",
            borderWidth: 2,
            tension: 0.1,
            yAxisID: "y1",
            pointRadius: 0,
          },
          {
            type: "bar" as const,
            label: "Weight (t)",
            data: apiBody.barWeights ?? [],
            backgroundColor: "#0077b6",
            yAxisID: "y",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index" as const, intersect: false },
        scales: {
          x: {
            ticks: { font: { size: 8 }, maxRotation: 45, minRotation: 45 },
          },
          y: {
            type: "linear" as const,
            display: true,
            position: "left" as const,
            title: { display: true, text: "Weight (t)", font: { size: 10 } },
          },
          y1: {
            type: "linear" as const,
            display: true,
            position: "right" as const,
            grid: { drawOnChartArea: false },
            title: { display: true, text: "Pallets / Trucks", font: { size: 10 } },
          },
        },
        plugins: {
          legend: { position: "top" as const, labels: { boxWidth: 14, font: { size: 10 } } },
        },
      },
    };
  }, [apiBody]);

  const crossings = useMemo(() => {
    if (!apiBody?.departingLabels || !apiBody?.stackedDatasets) return null;
    return {
      data: {
        labels: apiBody.departingLabels,
        datasets: apiBody.stackedDatasets.map((ds) => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.backgroundColor || "#0077b6",
          stack: "weight",
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: {
            stacked: true,
            title: { display: true, text: "Weight (t)", font: { size: 10 } },
          },
        },
        plugins: {
          legend: { position: "right" as const, labels: { boxWidth: 14, font: { size: 10 } } },
        },
      },
    };
  }, [apiBody]);

  const orgTotals = useMemo(() => {
    if (!apiBody?.orgLabels || !apiBody?.orgTruckCounts || !apiBody?.orgPalletCounts) return null;
    return {
      data: {
        labels: apiBody.orgLabels,
        datasets: [
          {
            label: "Trucks",
            data: apiBody.orgTruckCounts,
            borderColor: "#00b4d8",
            backgroundColor: "#00b4d8",
            yAxisID: "y",
            tension: 0.3,
            fill: false,
          },
          {
            label: "Pallets",
            data: apiBody.orgPalletCounts,
            borderColor: "#f59e0b",
            backgroundColor: "#f59e0b",
            yAxisID: "y1",
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { font: { size: 9 }, maxRotation: 25, minRotation: 25 },
          },
          y: {
            type: "linear" as const,
            position: "left" as const,
            title: { display: true, text: "Trucks", font: { size: 10 } },
          },
          y1: {
            type: "linear" as const,
            position: "right" as const,
            grid: { drawOnChartArea: false },
            title: { display: true, text: "Pallets", font: { size: 10 } },
          },
        },
        plugins: {
          legend: { position: "top" as const, labels: { boxWidth: 14, font: { size: 10 } } },
        },
      },
    };
  }, [apiBody]);

  return (
    <div className="mt-10 space-y-8">
      {/* Top row: commodity pie + daily trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-institutional-white border border-institutional-border rounded-sm px-6 py-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-muted text-center mb-4">Collected Weight (t) by Commodity</h3>
          <div className="h-[260px] lg:h-[320px]">{commodityPie && <Pie data={commodityPie.data} options={commodityPie.options} />}</div>
        </div>
        <div className="bg-institutional-white border border-institutional-border rounded-sm px-6 py-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-muted text-center mb-4">Collected Daily Trends</h3>
          <div className="h-[260px] lg:h-[320px]">{dailyTrends && <Bar data={dailyTrends.data} options={dailyTrends.options} />}</div>
        </div>
      </div>

      {/* Bottom row: crossings stacked bar + org totals */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-institutional-white border border-institutional-border rounded-sm px-6 py-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-muted text-center mb-4">
            Weight (t) by Crossing Location and Commodity
          </h3>
          <div className="h-[260px] lg:h-[320px]">{crossings && <Bar data={crossings.data} options={crossings.options} />}</div>
        </div>
        <div className="bg-institutional-white border border-institutional-border rounded-sm px-6 py-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-muted text-center mb-4">Total Trucks and Pallets by Organization</h3>
          <div className="h-[260px] lg:h-[320px]">{orgTotals && <Line data={orgTotals.data} options={orgTotals.options} />}</div>
        </div>
      </div>
    </div>
  );
}

