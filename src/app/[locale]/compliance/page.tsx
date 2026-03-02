import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import PageHero from "@/components/ui/PageHero";
import SectionBlock from "@/components/ui/SectionBlock";
import ComplianceBadge from "@/components/ui/ComplianceBadge";
import ExternalAuthorityLinks from "@/components/ui/ExternalAuthorityLinks";

export const metadata: Metadata = {
  title: "The Benchmark of Regulatory Integrity",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CompliancePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const page = dict.pages.compliance;

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        imageSrc="/images/hero-compliance.jpg"
        imageAlt="Data and audit dashboard representing ESPA Israel's regulatory integrity and compliance"
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

        <ComplianceBadge title={page.guaranteeTitle} items={page.guaranteeItems} />
        <ExternalAuthorityLinks dict={dict} />
      </div>
    </>
  );
}
