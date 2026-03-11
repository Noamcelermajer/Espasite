import Link from "next/link";
import { UN2720_COLLECTED_URL, UN2720_INFO_URL, fetchUn2720CollectedData } from "@/lib/un2720";
import type { Dictionary } from "@/lib/dictionaries";

interface Un2720SectionProps {
  dict: Dictionary;
}

export default async function Un2720Section({ dict }: Un2720SectionProps) {
  const data = await fetchUn2720CollectedData();
  const t = dict.un2720;

  const summary = data?.summary ?? null;
  const organizations = data?.organizations ?? [];

  const topOrganizations = organizations.slice(0, 8);
  const maxTrucks = topOrganizations.reduce((max, row) => (row.trucks > max ? row.trucks : max), 0);
  const totalPallets = topOrganizations.reduce((sum, row) => sum + row.pallets, 0);

  const pieColors = [
    "#0f172a", // navy
    "#1d4ed8",
    "#0ea5e9",
    "#14b8a6",
    "#22c55e",
    "#eab308",
    "#f97316",
    "#ef4444",
  ];

  let currentOffset = 0;
  const pieSegments = topOrganizations.map((row, index) => {
    const value = totalPallets ? (row.pallets / totalPallets) * 100 : 0;
    const start = currentOffset;
    const end = start + value;
    currentOffset = end;
    const color = pieColors[index % pieColors.length];
    return `${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
  });

  const pieStyle =
    totalPallets > 0
      ? {
          backgroundImage: `conic-gradient(${pieSegments.join(", ")})`,
        }
      : undefined;

  return (
    <section className="border-t border-institutional-border bg-institutional-off-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Intro + CTA */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-navy mb-2">{t.title}</h2>
          <p className="text-slate text-sm leading-relaxed max-w-xl">{t.subtitle}</p>
          <Link
            href={UN2720_COLLECTED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-institutional-white text-sm font-semibold rounded-sm no-underline hover:bg-navy-light transition-colors"
          >
            {t.viewDashboard}
            <span aria-hidden="true">&#8599;</span>
          </Link>
        </div>

        {/* Top-level stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-institutional-white border border-institutional-border rounded-sm p-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">{t.statPallets}</p>
            <p className="text-lg font-bold text-navy mt-0.5">
              {summary ? summary.pallets.toLocaleString() : "\u2014"}
            </p>
          </div>
          <div className="bg-institutional-white border border-institutional-border rounded-sm p-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">{t.statTrucks}</p>
            <p className="text-lg font-bold text-navy mt-0.5">
              {summary ? summary.trucks.toLocaleString() : "\u2014"}
            </p>
          </div>
          <div className="bg-institutional-white border border-institutional-border rounded-sm p-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">{t.statWeight}</p>
            <p className="text-lg font-bold text-navy mt-0.5">
              {summary ? summary.weightTonnes.toLocaleString() : "\u2014"}
            </p>
          </div>
          <div className="bg-institutional-white border border-institutional-border rounded-sm p-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">{t.statRequests}</p>
            <p className="text-lg font-bold text-navy mt-0.5">
              {summary ? summary.numberOfRequests.toLocaleString() : "\u2014"}
            </p>
          </div>
        </div>

        {/* Charts: bar + pie-style share */}
        {topOrganizations.length > 0 && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
            {/* Trucks by organization (bar chart) */}
            <div className="bg-institutional-white border border-institutional-border rounded-sm p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-muted mb-3">
                Trucks by organization (top {topOrganizations.length})
              </h3>
              <div className="space-y-2">
                {topOrganizations.map((row) => (
                  <div key={row.organization} className="flex items-center gap-3">
                    <span className="text-xs text-slate min-w-[5rem] truncate">{row.organization}</span>
                    <div className="flex-1 bg-institutional-off-white h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-navy"
                        style={{ width: `${maxTrucks ? (row.trucks / maxTrucks) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-muted min-w-[3rem] text-right">
                      {row.trucks.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pallet share (pie-style) */}
            <div className="bg-institutional-white border border-institutional-border rounded-sm p-4 flex flex-col items-stretch">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-muted mb-3">
                Pallet share by organization (top {topOrganizations.length})
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="relative h-32 w-32 shrink-0 rounded-full border border-institutional-border bg-institutional-off-white"
                  style={pieStyle}
                >
                  <div className="absolute inset-5 rounded-full bg-institutional-white flex items-center justify-center">
                    <span className="text-[10px] text-slate-muted text-center leading-tight">
                      Total
                      <br />
                      {totalPallets.toLocaleString()} pallets
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-1 max-h-32 overflow-y-auto pr-1 text-xs">
                  {topOrganizations.map((row, index) => {
                    const color = pieColors[index % pieColors.length];
                    const ratio = totalPallets ? (row.pallets / totalPallets) * 100 : 0;
                    return (
                      <div key={row.organization} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-sm"
                          style={{ backgroundColor: color }}
                          aria-hidden="true"
                        />
                        <span className="flex-1 truncate text-slate">{row.organization}</span>
                        <span className="text-[10px] font-mono text-slate-muted whitespace-nowrap">
                          {row.pallets.toLocaleString()} ({ratio.toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary by Organization table */}
        <div className="mt-10 rounded-sm border border-institutional-border bg-institutional-white overflow-hidden">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-muted px-4 py-3 border-b border-institutional-border">
            {t.tableTitle}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-institutional-border bg-institutional-off-white">
                  <th className="text-start font-semibold text-navy px-4 py-3">{t.tableOrg}</th>
                  <th className="text-right font-semibold text-navy px-4 py-3">{t.tableTrucks}</th>
                  <th className="text-right font-semibold text-navy px-4 py-3">{t.tablePallets}</th>
                  <th className="text-right font-semibold text-navy px-4 py-3">{t.tableWeight}</th>
                  <th className="text-right font-semibold text-navy px-4 py-3">{t.tableRequests}</th>
                </tr>
              </thead>
              <tbody>
                {organizations.length > 0 ? (
                  organizations.map((row, i) => (
                    <tr key={i} className="border-b border-institutional-border last:border-b-0">
                      <td className="px-4 py-3 text-slate text-start">{row.organization}</td>
                      <td className="px-4 py-3 text-slate text-right tabular-nums">{row.trucks.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate text-right tabular-nums">{row.pallets.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate text-right tabular-nums">
                        {row.weightTonnes.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate text-right tabular-nums">
                        {row.numberOfRequests.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-muted">
                      <Link
                        href={UN2720_COLLECTED_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy underline underline-offset-2"
                      >
                        {t.noDataHint}
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-muted max-w-2xl">
          {t.disclaimer}{" "}
          <a
            href={UN2720_INFO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy underline underline-offset-2"
          >
            {t.sourceLabel}
          </a>
        </p>
      </div>
    </section>
  );
}
