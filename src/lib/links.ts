export interface AuthorityLink {
  label: string;
  href: string;
  description: string;
  logo?: string;
}

export const AUTHORITY_LINKS: AuthorityLink[] = [
  {
    label: "Israeli Gov: International Organizations",
    href: "https://www.gov.il/en/Departments/units/ninternational_organizations_unit",
    description: "Ministry of Foreign Affairs, International Organizations Unit",
    logo: "/images/emblem-israel.png",
  },
  {
    label: "U.S. Embassy: Office of Defense Cooperation",
    href: "https://il.usembassy.gov/office-of-defense-cooperation/",
    description: "United States Embassy in Israel, ODC",
    logo: "/images/logo-us-embassy.png",
  },
  {
    label: "UNOCHA: We Coordinate",
    href: "https://www.unocha.org/we-coordinate",
    description: "United Nations Office for the Coordination of Humanitarian Affairs",
    logo: "/images/logo-unocha.svg",
  },
  {
    label: "Gaza Aid Data",
    href: "https://gaza-aid-data.gov.il/mainhome/",
    description: "Official Government Portal for Gaza Aid Coordination Data",
    logo: "/images/logo-gaza-aid.png",
  },
];

export const NAV_LINKS = [
  { label: "Mandate", href: "/mandate" },
  { label: "Operations", href: "/operations" },
  { label: "Compliance", href: "/compliance" },
  { label: "Philanthropy", href: "/philanthropy" },
] as const;

export const TICKET_ID = "2118889092";
export const REGISTRATION_TEXT = "Authorized National Representative Office of Fundacja ESPA (Poland)";
