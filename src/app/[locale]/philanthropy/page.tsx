import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import PageHero from "@/components/ui/PageHero";
import SectionBlock from "@/components/ui/SectionBlock";
import CaseStudyCard from "@/components/ui/CaseStudyCard";
import ComplianceBadge from "@/components/ui/ComplianceBadge";
import ExternalAuthorityLinks from "@/components/ui/ExternalAuthorityLinks";

export const metadata: Metadata = {
  title: "Strategic Philanthropy & Institutional Implementation",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PhilanthropyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const page = dict.pages.philanthropy;

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        imageSrc="/images/hero-philanthropy.jpg"
        imageAlt="Stainless steel institutional kitchen symbolizing large-scale humanitarian nutritional infrastructure"
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

        <CaseStudyCard title={page.caseStudiesTitle} items={page.caseStudies} />
        <ComplianceBadge title={page.valuePropsTitle} items={page.valueProps} />

        <section className="py-10 border-t border-institutional-border mt-10">
          <div className="bg-institutional-off-white border border-institutional-border rounded-sm p-6">
            <h3 className="text-base font-bold text-navy mb-2">{page.partnershipTitle}</h3>
            <p className="text-sm text-slate leading-relaxed">{page.partnershipBody}</p>
          </div>
        </section>

        <ExternalAuthorityLinks dict={dict} />
      </div>
    </>
  );
}
