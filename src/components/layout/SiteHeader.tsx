"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TICKET_ID } from "@/lib/links";
import { localeNames, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface SiteHeaderProps {
  locale: Locale;
  dict: Dictionary;
}

const NAV_KEYS = ["mandate", "operations", "compliance", "philanthropy", "contact"] as const;

export default function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function localePath(slug: string) {
    return `/${locale}/${slug}`;
  }

  function switchLocalePath(target: Locale) {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = target;
    return `/${segments.join("/")}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-institutional-border bg-institutional-white/95 backdrop-blur-sm">
      {/* Trust bar */}
      <div className="border-b border-institutional-border bg-institutional-off-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-1.5 text-xs tracking-wide text-slate">
          <span className="min-w-0 font-medium">{dict.header.registration}</span>
          <span className="hidden flex-shrink-0 sm:inline font-mono text-slate-muted">
            {dict.header.ticketId}:&nbsp;{TICKET_ID}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-3 no-underline">
          <Image
            src="/images/logo-espa.png"
            alt="ESPA Israel"
            width={120}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {/* Desktop nav */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {NAV_KEYS.map((key) => {
              const href = localePath(key);
              const isActive = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  className={`
                    px-4 py-2 text-sm font-medium no-underline rounded-sm transition-colors whitespace-nowrap
                    ${isActive
                      ? "bg-navy text-institutional-white"
                      : "text-navy hover:bg-institutional-off-white"
                    }
                  `}
                >
                  {dict.nav[key]}
                </Link>
              );
            })}
          </nav>

          {/* Language switcher (desktop) */}
          <div className="ms-4 flex items-center border-s border-institutional-border ps-4">
            {(Object.entries(localeNames) as [Locale, string][]).map(([code, name]) => (
              <Link
                key={code}
                href={switchLocalePath(code)}
                className={`
                  px-2 py-1 text-xs font-medium no-underline rounded-sm transition-colors
                  ${locale === code
                    ? "bg-navy text-institutional-white"
                    : "text-slate-muted hover:text-navy"
                  }
                `}
                aria-current={locale === code ? "true" : undefined}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-navy"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={dict.header.toggleMenu}
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-institutional-border bg-institutional-white px-6 py-4" aria-label="Mobile navigation">
          {NAV_KEYS.map((key) => {
            const href = localePath(key);
            const isActive = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`
                  block py-2.5 text-sm font-medium no-underline border-b border-institutional-border last:border-0
                  ${isActive ? "text-navy font-bold" : "text-slate"}
                `}
              >
                {dict.nav[key]}
              </Link>
            );
          })}

          {/* Language switcher (mobile) */}
          <div className="flex items-center gap-2 pt-4 mt-2 border-t border-institutional-border">
            {(Object.entries(localeNames) as [Locale, string][]).map(([code, name]) => (
              <Link
                key={code}
                href={switchLocalePath(code)}
                onClick={() => setMenuOpen(false)}
                className={`
                  px-3 py-1.5 text-xs font-medium no-underline rounded-sm transition-colors
                  ${locale === code
                    ? "bg-navy text-institutional-white"
                    : "text-slate-muted border border-institutional-border"
                  }
                `}
              >
                {name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
