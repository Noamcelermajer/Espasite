import "@/styles/tokens.css";
import { notFound } from "next/navigation";
import { Inter, Assistant, Noto_Sans_Arabic } from "next/font/google";
import { isValidLocale, isRtl } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import type { Locale } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
});

function getFontClass(locale: Locale): string {
  if (locale === "he") return assistant.className;
  if (locale === "ar") return notoSansArabic.className;
  return inter.className;
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);
  const rtl = isRtl(typedLocale);

  return (
    <html lang={typedLocale} dir={rtl ? "rtl" : "ltr"}>
      <body className={`min-h-screen flex flex-col ${getFontClass(typedLocale)}`}>
        <OrganizationJsonLd />
        <SiteHeader locale={typedLocale} dict={dict} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={typedLocale} dict={dict} />
      </body>
    </html>
  );
}
