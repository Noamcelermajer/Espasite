import Link from "next/link";
import { UN2720_COLLECTED_URL, UN2720_INFO_URL, fetchUn2720CollectedData } from "@/lib/un2720";
import type { Dictionary } from "@/lib/dictionaries";

interface Un2720SectionProps {
  dict: Dictionary;
}

export default async function Un2720Section({ dict }: Un2720SectionProps) {
  const data = await fetchUn2720CollectedData();
  const t = dict.un2720;

  return (
    <section className="border-t border-institutional-border bg-institutional-off-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
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
          {data && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 shrink-0">
              <div className="bg-institutional-white border border-institutional-border rounded-sm p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Trucks</p>
                <p className="text-lg font-bold text-navy mt-0.5">{data.summary.trucks.toLocaleString()}</p>
              </div>
              <div className="bg-institutional-white border border-institutional-border rounded-sm p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Pallets</p>
                <p className="text-lg font-bold text-navy mt-0.5">{data.summary.pallets.toLocaleString()}</p>
              </div>
              <div className="bg-institutional-white border border-institutional-border rounded-sm p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Weight (t)</p>
                <p className="text-lg font-bold text-navy mt-0.5">{data.summary.weightTonnes.toLocaleString()}</p>
              </div>
              <div className="bg-institutional-white border border-institutional-border rounded-sm p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Requests</p>
                <p className="text-lg font-bold text-navy mt-0.5">{data.summary.numberOfRequests.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
        <p className="mt-6 text-xs text-slate-muted max-w-2xl">
          {t.disclaimer}{" "}
          <a href={UN2720_INFO_URL} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2">
            {t.sourceLabel}
          </a>
        </p>
        <div className="mt-6 rounded-sm overflow-hidden border border-institutional-border bg-institutional-white">
          <iframe
            title="UN2720 Monitoring and Tracking - Collected"
            src={UN2720_COLLECTED_URL}
            className="w-full h-[420px] border-0"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
