const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.espa-israel.com";
const root = baseUrl.replace(/\/$/, "");

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ESPA Israel",
  alternateName: "ESPA Israel - Authorized National Representative Office",
  url: root,
  logo: `${root}/images/logo-espa.png`,
  description:
    "ESPA Israel operates as the authorized national representative office of Fundacja ESPA (Poland), facilitating large-scale humanitarian operations through strict regulatory compliance.",
  foundingDate: "2024",
  areaServed: "IL",
  parentOrganization: {
    "@type": "Organization",
    name: "Fundacja ESPA (Poland)",
  },
};

export default function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
