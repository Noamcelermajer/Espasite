import Link from "next/link";
import { UN2720_COLLECTED_URL, UN2720_INFO_URL, fetchUn2720CollectedData } from "@/lib/un2720";
import type { Dictionary } from "@/lib/dictionaries";
import { Un2720ChartsClient } from "./Un2720ChartsClient";
import { FaBoxes, FaTruck, FaWeightHanging, FaFileAlt } from "react-icons/fa";

interface Un2720SectionProps {
  dict: Dictionary;
}

export default async function Un2720Section({ dict }: Un2720SectionProps) {
  const data = await fetchUn2720CollectedData();
  const t = dict.un2720;

  const summary = data?.summary ?? null;
  const organizations = data?.organizations ?? [];
  const apiPayloads = data?.apiPayloads;

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
        {/* Summary header + KPI cards, styled similar to charts.html */}
        <div className="mt-6">
          <div className="mb-4 flex items-baseline gap-2 border-b border-institutional-border pb-3">
            <h3 className="text-lg font-bold text-navy">Collected</h3>
            <span className="text-xs text-slate-muted">
              From any of the crossings along Gaza&apos;s perimeter
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-institutional-white border border-institutional-border rounded-sm px-5 py-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3 text-navy">
                <FaBoxes className="h-4 w-4" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-wide">{t.statPallets}</span>
              </div>
              <p className="text-3xl font-bold text-navy text-center">
                {summary ? summary.pallets.toLocaleString() : "—"}
              </p>
            </div>
            <div className="bg-institutional-white border border-institutional-border rounded-sm px-5 py-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3 text-navy">
                <FaTruck className="h-4 w-4" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-wide">{t.statTrucks}</span>
              </div>
              <p className="text-3xl font-bold text-navy text-center">
                {summary ? summary.trucks.toLocaleString() : "—"}
              </p>
            </div>
            <div className="bg-institutional-white border border-institutional-border rounded-sm px-5 py-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3 text-navy">
                <FaWeightHanging className="h-4 w-4" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-wide">{t.statWeight}</span>
              </div>
              <p className="text-3xl font-bold text-navy text-center">
                {summary ? summary.weightTonnes.toLocaleString() : "—"}
              </p>
            </div>
            <div className="bg-institutional-white border border-institutional-border rounded-sm px-5 py-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3 text-navy">
                <FaFileAlt className="h-4 w-4" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-wide">{t.statRequests}</span>
              </div>
              <p className="text-3xl font-bold text-navy text-center">
                {summary ? summary.numberOfRequests.toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* UN-style charts driven by raw API payloads */}
        <Un2720ChartsClient apiPayloads={apiPayloads} />

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
