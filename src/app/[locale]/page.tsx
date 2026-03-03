import Link from "next/link";
import { TICKET_ID } from "@/lib/links";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { notFound } from "next/navigation";

const NAV_KEYS = ["mandate", "operations", "compliance", "philanthropy", "contact"] as const;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      {/* Intro — conservative palette: navy, slate, white only */}
      <section className="border-b border-institutional-border bg-institutional-white">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <h2 className="text-xl font-bold text-navy mb-4">{dict.home.introHeading}</h2>
          <p className="text-slate max-w-3xl leading-relaxed">
            {dict.home.introBody}
          </p>
        </div>
      </section>

      {/* Quick nav grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-bold text-navy mb-2">{dict.home.overviewTitle}</h2>
        <p className="text-slate mb-10 max-w-xl">{dict.home.overviewSubtitle}</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {NAV_KEYS.map((key, i) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className="group flex gap-5 border border-institutional-border rounded-sm p-6 no-underline hover:border-navy/30 hover:bg-institutional-off-white transition-all"
            >
              <span className="flex-none flex items-center justify-center w-10 h-10 rounded-sm bg-navy text-institutional-white text-sm font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <span className="block text-base font-bold text-navy group-hover:text-navy-light transition-colors">
                  {dict.nav[key]}
                </span>
                <span className="block text-sm text-slate-muted mt-1">
                  {dict.home.navDescriptions[key]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-institutional-border bg-institutional-off-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-muted mb-3">
            {dict.home.regulatoryFramework}
          </p>
          <p className="text-sm text-slate max-w-2xl mx-auto leading-relaxed">
            {dict.home.regulatoryBody}
          </p>
        </div>
      </section>
    </>
  );
}
