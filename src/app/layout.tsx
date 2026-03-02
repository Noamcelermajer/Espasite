import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | ESPA Israel",
    default: "ESPA Israel — Authorized National Representative Office",
  },
  description:
    "ESPA Israel operates as the authorized national representative office of Fundacja ESPA (Poland), facilitating large-scale humanitarian operations through strict regulatory compliance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
