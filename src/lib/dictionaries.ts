import type { Locale } from "./i18n";

export interface Dictionary {
  nav: {
    mandate: string;
    operations: string;
    compliance: string;
    philanthropy: string;
    contact: string;
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
    submitOperationalInquiry: string;
    overviewTitle: string;
    overviewSubtitle: string;
    introHeading: string;
    introBody: string;
    regulatoryFramework: string;
    regulatoryBody: string;
    navDescriptions: {
      mandate: string;
      operations: string;
      compliance: string;
      philanthropy: string;
      contact: string;
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
  contact: {
    title: string;
    subtitle: string;
    heading: string;
    body: string;
    emailLabel: string;
    email: string;
    cta: string;
    note: string;
  };
  institutionalRefs: {
    title: string;
    fallback: string;
  };
  un2720: {
    title: string;
    subtitle: string;
    viewDashboard: string;
    disclaimer: string;
    sourceLabel: string;
    statPallets: string;
    statTrucks: string;
    statWeight: string;
    statRequests: string;
    tableTitle: string;
    tableOrg: string;
    tableTrucks: string;
    tablePallets: string;
    tableWeight: string;
    tableRequests: string;
    noDataHint: string;
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
