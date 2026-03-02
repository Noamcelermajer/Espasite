import "@/styles/tokens.css";
import { notFound } from "next/navigation";
import { isValidLocale, isRtl } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import type { Locale } from "@/lib/i18n";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const rtl = isRtl(locale as Locale);

  return (
    <html lang={locale} dir={rtl ? "rtl" : "ltr"}>
      <body className="min-h-screen flex flex-col">
        <SiteHeader locale={locale as Locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale as Locale} dict={dict} />
      </body>
    </html>
  );
}
