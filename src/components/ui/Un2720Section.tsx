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

  return (
    <section className="border-t border-institutional-border bg-institutional-off-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Intro + CTA */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
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

          {/* Stat cards: Pallets, Trucks, Weight, Requests */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 shrink-0">
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
        </div>

        {/* Summary by Organization table */}
        <div className="mt-8 rounded-sm border border-institutional-border bg-institutional-white overflow-hidden">
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
                      <td className="px-4 py-3 text-slate text-right tabular-nums">{row.weightTonnes.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate text-right tabular-nums">{row.numberOfRequests.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-muted">
                      <Link href={UN2720_COLLECTED_URL} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2">
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
          <a href={UN2720_INFO_URL} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2">
            {t.sourceLabel}
          </a>
        </p>
      </div>
    </section>
  );
}
