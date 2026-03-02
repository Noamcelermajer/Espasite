export interface SectionContent {
  heading: string;
  body: string;
}

export interface DirectorateContent {
  title: string;
  description: string;
}

export interface CaseStudy {
  title: string;
  description: string;
}

export interface PageContent {
  slug: string;
  title: string;
  subtitle?: string;
  sections: SectionContent[];
  directorates?: DirectorateContent[];
  caseStudies?: CaseStudy[];
  valueProps?: SectionContent[];
}

export const PAGES: Record<string, PageContent> = {
  mandate: {
    slug: "mandate",
    title: "Strategic Mandate & Alignment",
    subtitle: "Institutional Framework for Humanitarian Excellence",
    sections: [
      {
        heading: "Mission & Mandate",
        body: "ESPA Israel operates as the authorized national representative office of Fundacja ESPA (Poland). Our mission is to facilitate large-scale humanitarian operations through a framework of strict regulatory compliance and strategic transparency.",
      },
      {
        heading: "Regional Stability & Economic Cooperation",
        body: "In alignment with emerging regional frameworks, ESPA Israel supports the vision of economic peace and regional prosperity. Our operations are synchronized with the strategic objectives of the Peace Council and relevant sovereign stakeholders, ensuring that humanitarian efforts contribute directly to long-term stability and civilian resilience.",
      },
      {
        heading: "Core Objective",
        body: "To serve as a professional bridge between international resources and local implementation, upholding the highest standards of governance as mandated by the Inter-Ministerial regulatory authorities.",
      },
    ],
  },

  operations: {
    slug: "operations",
    title: "Command, Control & Operational Synergy",
    subtitle: "Multi-Layered Architecture for High-Stakes Environments",
    sections: [
      {
        heading: "Operational Architecture",
        body: "ESPA Israel utilizes a multi-layered command structure designed for high-stakes environments. Each humanitarian project is managed through a comprehensive Action File (AF) protocol, ensuring an unbroken chain of custody and accountability.",
      },
    ],
    directorates: [
      {
        title: "Executive Leadership & Governance",
        description: "Oversight of legal risk management, sovereign relations, and corporate governance.",
      },
      {
        title: "Logistics & Compliance Management",
        description: "Specialized execution of trade and supply chain operations under stringent regulatory constraints, ensuring seamless movement through official channels.",
      },
      {
        title: "Systems Integrity & Digital Auditing",
        description: "Managed by internal specialists, this directorate maintains real-time Audit Logs, rigorous Donor Vetting, and secure data environments.",
      },
      {
        title: "Field Verification & Security",
        description: "Led by veterans of elite tactical units, this department conducts physical vetting of vendors and provides mission-critical security to prevent aid diversion.",
      },
    ],
  },

  compliance: {
    slug: "compliance",
    title: "The Benchmark of Regulatory Integrity",
    subtitle: "A Distinctive Standard of Compliance",
    sections: [
      {
        heading: "A Distinctive Standard of Compliance",
        body: "In the complex landscape of 2026, regulatory proficiency has become the primary prerequisite for humanitarian impact. Following a significant industry shift — which saw the closure of 37 international entities due to compliance failures — ESPA Israel has solidified its position as a Rare Institutional Asset.",
      },
      {
        heading: "Grandfathered Status & Institutional Continuity",
        body: "Holding a valid and active registration (Ticket ID: 2118889092), ESPA Israel offers a stable and secure \"Grandfathered\" status. This provides our partners with a protected operational environment in a market that is currently restricted to new entrants.",
      },
    ],
    valueProps: [
      {
        heading: "Audit-Ready Infrastructure",
        body: "Our systems are designed for immediate review by international oversight bodies and the Peace Council.",
      },
      {
        heading: "Sovereign Synergy",
        body: "Deep-rooted expertise in navigating Israeli and international bureaucratic requirements.",
      },
      {
        heading: "Zero-Tolerance Protocol",
        body: "Rigorous internal controls to ensure absolute transparency and the prevention of unauthorized resource allocation.",
      },
    ],
  },

  philanthropy: {
    slug: "philanthropy",
    title: "Strategic Philanthropy & Institutional Implementation",
    subtitle: "The Trusted Channel for Sovereign and Institutional Donors",
    sections: [
      {
        heading: "Operational Trust Model",
        body: "ESPA Israel serves as the executive and administrative arm for sovereign states, embassies, and international organizations seeking to support vulnerable populations in conflict zones. We offer a working model based on \"Operational Trust\", enabling institutional donors to realize their humanitarian vision through a fully approved, transparent, and secured platform.",
      },
      {
        heading: "Government-Grade Donor Management",
        body: "Our operations are aligned with the most stringent standards of diplomatic missions and governments across Europe and the Gulf states. We specialize in managing humanitarian resources while ensuring aid reaches its civilian destination only, with zero exposure to compliance risks or aid diversion.",
      },
    ],
    caseStudies: [
      {
        title: "Mass Nutritional Initiatives",
        description: "Operating large-scale nutrition and humanitarian infrastructure (field kitchens and distribution centers) serving tens of thousands of beneficiaries daily, with compliance-driven logistical and operational precision.",
      },
      {
        title: "Legal & Humanitarian Advocacy",
        description: "Establishing humanitarian legal protection frameworks, safeguarding the rights of civilian populations and the security of donors alike.",
      },
      {
        title: "Direct Sovereign Support",
        description: "Managing earmarked projects for governments and state entities, including procurement, transport, and physical field verification under strict oversight.",
      },
    ],
    valueProps: [
      {
        heading: "Compliance-as-a-Service",
        body: "We remove the bureaucratic and regulatory burden from donors vis-a-vis Israeli state authorities.",
      },
      {
        heading: "Multilateral Accountability",
        body: "Our reporting system is tailored to the requirements of the Peace Council and international oversight bodies.",
      },
      {
        heading: "Risk Mitigation",
        body: "Utilizing Vetting technology and Audit Logs ensuring complete sterility of every dollar and every shipment.",
      },
    ],
  },
};
