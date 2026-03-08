import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.espa-israel.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | ESPA Israel",
    default: "ESPA Israel | Authorized National Representative Office",
  },
  description:
    "ESPA Israel operates as the authorized national representative office of Fundacja ESPA (Poland), facilitating large-scale humanitarian operations through strict regulatory compliance.",
  openGraph: {
    title: "ESPA Israel | Authorized National Representative Office",
    description:
      "ESPA Israel operates as the authorized national representative office of Fundacja ESPA (Poland), facilitating large-scale humanitarian operations through strict regulatory compliance.",
    url: "/",
    siteName: "ESPA Israel",
    locale: "en",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico", sizes: "any" },
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/images/favicon/apple-touch-icon.png",
  },
  manifest: "/images/favicon/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
