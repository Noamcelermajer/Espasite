export const locales = ["en", "he", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["he", "ar"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  ar: "العربية",
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
