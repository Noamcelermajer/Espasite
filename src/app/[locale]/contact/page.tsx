import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import ExternalAuthorityLinks from "@/components/ui/ExternalAuthorityLinks";

export const metadata: Metadata = {
  title: "Contact | ESPA Israel",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const c = dict.contact;

  return (
    <>
      <div className="bg-navy text-institutional-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h1 className="text-institutional-white text-3xl md:text-4xl font-bold tracking-tight">
            {c.title}
          </h1>
          <p className="mt-3 text-lg text-institutional-white/80 leading-relaxed max-w-2xl">
            {c.subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <section className="py-12 md:py-16">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-navy mb-4 border-l-4 border-navy pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
              {c.heading}
            </h2>
            <p className="text-slate leading-relaxed mb-8">
              {c.body}
            </p>

            <div className="border border-institutional-border rounded-sm p-6 bg-institutional-off-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-muted mb-2">
                {c.emailLabel}
              </p>
              <a
                href={`mailto:${c.email}`}
                className="text-lg font-bold text-navy hover:underline underline-offset-4"
              >
                {c.email}
              </a>

              <div className="mt-6">
                <a
                  href={`mailto:${c.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-institutional-white text-sm font-semibold rounded-sm no-underline hover:bg-navy-light transition-colors"
                >
                  {c.cta}
                </a>
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-muted leading-relaxed">
              {c.note}
            </p>
          </div>
        </section>

        <ExternalAuthorityLinks dict={dict} />
      </div>
    </>
  );
}
