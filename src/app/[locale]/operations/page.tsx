import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import PageHero from "@/components/ui/PageHero";
import SectionBlock from "@/components/ui/SectionBlock";
import DirectorateList from "@/components/ui/DirectorateList";
import ExternalAuthorityLinks from "@/components/ui/ExternalAuthorityLinks";

export const metadata: Metadata = {
  title: "Command, Control & Operational Synergy",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function OperationsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const page = dict.pages.operations;

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        imageSrc="/images/hero-operations.jpg"
        imageAlt="Humanitarian aid convoy illustrating ESPA Israel's operational logistics architecture"
      />
      <div className="mx-auto max-w-6xl px-6">
        <SectionBlock heading={page.architectureHeading}>
          <p>{page.architectureBody}</p>
        </SectionBlock>

        <section className="pb-10 border-b border-institutional-border">
          <h2 className="text-xl font-bold mb-2 border-l-4 border-navy pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
            {page.directoratesHeading}
          </h2>
          <DirectorateList items={page.directorates} />
        </section>

        <ExternalAuthorityLinks dict={dict} />
      </div>
    </>
  );
}
