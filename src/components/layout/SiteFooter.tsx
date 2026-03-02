import Image from "next/image";
import { TICKET_ID, AUTHORITY_LINKS } from "@/lib/links";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

interface SiteFooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function SiteFooter({ dict }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-institutional-border bg-navy text-institutional-white/80">
      {/* Authority links strip */}
      <div className="border-b border-institutional-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-institutional-white/50">
            {dict.footer.institutionalReferences}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {AUTHORITY_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-sm text-institutional-white/70 underline-offset-3 hover:text-institutional-white transition-colors"
                title={link.description}
              >
                {link.logo && (
                  <Image
                    src={link.logo}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 flex-none object-contain brightness-0 invert opacity-50 group-hover:opacity-80 transition-opacity"
                    aria-hidden="true"
                  />
                )}
                {link.label}&nbsp;&rarr;
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-institutional-white/50">
        <span>&copy; {year} {dict.footer.copyright} &mdash; {dict.header.registration}</span>
        <span className="font-mono">{dict.header.ticketId}:&nbsp;{TICKET_ID}</span>
      </div>
    </footer>
  );
}
