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
    "#1565c0",
    "#1e88e5",
    "#42a5f5",
    "#29b6f6",
    "#26c6da",
    "#26a69a",
    "#ffee58",
    "#ffb300",
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
        {/* Summary text + inline stats, visually aligned with UN2720 header block */}
        <div className="mt-6 bg-institutional-white border border-institutional-border rounded-sm px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">
            Collected from crossings along Gaza&apos;s perimeter
          </p>
          <div className="mt-4 grid gap-3 text-sm text-slate sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">{t.statPallets}</p>
              {t.statPallets}{" "}
              <span className="font-semibold text-navy">
                {summary ? summary.pallets.toLocaleString() : "—"}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">{t.statTrucks}</p>
              {t.statTrucks}{" "}
              <span className="font-semibold text-navy">
                {summary ? summary.trucks.toLocaleString() : "—"}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">{t.statWeight}</p>
              {t.statWeight}{" "}
              <span className="font-semibold text-navy">
                {summary ? summary.weightTonnes.toLocaleString() : "—"}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">{t.statRequests}</p>
              {t.statRequests}{" "}
              <span className="font-semibold text-navy">
                {summary ? summary.numberOfRequests.toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Charts: bar + pie-style share, no tables */}
        {topOrganizations.length > 0 && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
            {/* Trucks by organization (bar chart), styled similarly to UN2720 charts */}
            <div className="bg-institutional-white border border-institutional-border rounded-sm px-6 py-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate mb-4">
                Trucks by organization (top {topOrganizations.length})
              </h3>
              <div className="space-y-2">
                {topOrganizations.map((row) => (
                  <div key={row.organization} className="flex items-center gap-3">
                    <span className="text-[11px] text-slate min-w-[6rem] truncate">{row.organization}</span>
                    <div className="flex-1 bg-slate-100 h-3 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-[#1e88e5]"
                        style={{ width: `${maxTrucks ? (row.trucks / maxTrucks) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-muted min-w-[3rem] text-right">
                      {row.trucks.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pallet share (pie-style), styled as UN2720-style legend + donut */}
            <div className="bg-institutional-white border border-institutional-border rounded-sm px-6 py-5 flex flex-col items-stretch shadow-sm">
              <h3 className="text-sm font-semibold text-slate mb-4">
                Pallet share by organization (top {topOrganizations.length})
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="relative h-36 w-36 shrink-0 rounded-full border border-slate-200 bg-white"
                  style={pieStyle}
                >
                  <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[10px] text-slate-muted text-center leading-tight">
                      Total
                      <br />
                      {totalPallets.toLocaleString()} pallets
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-1 max-h-36 overflow-y-auto pr-1 text-xs">
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

        <div className="mt-6 text-xs text-slate-muted max-w-3xl space-y-2">
          <p className="font-semibold uppercase tracking-wider">Disclaimers</p>
          <p>
            Data presented on this dashboard include only humanitarian relief consignments processed through the{" "}
            <span className="font-semibold">UN2720</span> Mechanism. For more on how the{" "}
            <span className="font-semibold">UN2720</span> Mechanism works, please go to{" "}
            <a
              href={UN2720_INFO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy underline underline-offset-2"
            >
              {UN2720_INFO_URL}
            </a>
            .
          </p>
          <p>
            The numbers expressed reflect data available through a combination of on-the-ground{" "}
            <span className="font-semibold">UN2720</span> Monitors and cross-verification with partners. They remain
            subject to change, reflecting the movement of consignments and the dynamic nature of the context.
          </p>
          <p>
            Trucks on the Gaza side of the Kerem Shalom/Karem Abu Salem and Erez West/Zikim crossings are typically
            smaller than those arriving from the Israeli side. As a result, the number of trucks reaching the crossings
            does not correspond directly to the number collected on the Gaza side.
          </p>
          <p>
            Data shown here are represented exactly as they are currently made publicly available via the official{" "}
            <a
              href={UN2720_COLLECTED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy underline underline-offset-2"
            >
              UN2720 Monitoring &amp; Tracking dashboard
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
