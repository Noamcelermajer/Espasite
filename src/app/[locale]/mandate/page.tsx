import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import PageHero from "@/components/ui/PageHero";
import SectionBlock from "@/components/ui/SectionBlock";
import ExternalAuthorityLinks from "@/components/ui/ExternalAuthorityLinks";

export const metadata: Metadata = {
  title: "Strategic Mandate & Alignment",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function MandatePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const page = dict.pages.mandate;

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        imageSrc="/images/hero-mandate.jpg.avif"
        imageAlt="Institutional government building under clear skies symbolizing ESPA Israel's strategic mandate"
      />
      <div className="mx-auto max-w-6xl px-6">
        {page.sections.map((section, i) => (
          <SectionBlock
            key={i}
            heading={section.heading}
            className={i < page.sections.length - 1 ? "border-b border-institutional-border" : ""}
          >
            <p>{section.body}</p>
          </SectionBlock>
        ))}
        <ExternalAuthorityLinks dict={dict} />
      </div>
    </>
  );
}
