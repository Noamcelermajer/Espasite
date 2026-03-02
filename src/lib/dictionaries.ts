import type { Locale } from "./i18n";

export interface Dictionary {
  nav: {
    mandate: string;
    operations: string;
    compliance: string;
    philanthropy: string;
  };
  header: {
    registration: string;
    ticketId: string;
    toggleMenu: string;
  };
  footer: {
    institutionalReferences: string;
    copyright: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    viewMandate: string;
    complianceFramework: string;
    overviewTitle: string;
    overviewSubtitle: string;
    regulatoryFramework: string;
    regulatoryBody: string;
    navDescriptions: {
      mandate: string;
      operations: string;
      compliance: string;
      philanthropy: string;
    };
  };
  pages: {
    mandate: {
      title: string;
      subtitle: string;
      sections: { heading: string; body: string }[];
    };
    operations: {
      title: string;
      subtitle: string;
      architectureHeading: string;
      architectureBody: string;
      directoratesHeading: string;
      directorates: { title: string; description: string }[];
    };
    compliance: {
      title: string;
      subtitle: string;
      sections: { heading: string; body: string }[];
      guaranteeTitle: string;
      guaranteeItems: { heading: string; body: string }[];
    };
    philanthropy: {
      title: string;
      subtitle: string;
      sections: { heading: string; body: string }[];
      caseStudiesTitle: string;
      caseStudies: { title: string; description: string }[];
      valuePropsTitle: string;
      valueProps: { heading: string; body: string }[];
      partnershipTitle: string;
      partnershipBody: string;
    };
  };
  institutionalRefs: {
    title: string;
    fallback: string;
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  he: () => import("@/dictionaries/he.json").then((m) => m.default),
  ar: () => import("@/dictionaries/ar.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
