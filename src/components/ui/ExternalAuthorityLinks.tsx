import Image from "next/image";
import { AUTHORITY_LINKS } from "@/lib/links";
import type { Dictionary } from "@/lib/dictionaries";

interface ExternalAuthorityLinksProps {
  dict: Dictionary;
}

export default function ExternalAuthorityLinks({ dict }: ExternalAuthorityLinksProps) {
  return (
    <section className="py-10 border-t border-institutional-border">
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/images/emblem-israel.png"
          alt="State of Israel Emblem"
          width={40}
          height={48}
          className="h-10 w-auto flex-none"
        />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-muted">
          {dict.institutionalRefs.title}
        </h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {AUTHORITY_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-sm border border-institutional-border p-4 no-underline transition-all hover:border-navy/30 hover:bg-institutional-off-white"
          >
            {link.logo && (
              <Image
                src={link.logo}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 flex-none object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />
            )}
            <div className="min-w-0">
              <span className="block text-sm font-medium text-navy">{link.label}</span>
              <span className="block text-xs text-slate-muted mt-0.5">{link.description}</span>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-muted/60">
        {dict.institutionalRefs.fallback}
      </p>
    </section>
  );
}
