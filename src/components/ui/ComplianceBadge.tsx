import type { SectionContent } from "@/content/pages";

interface ComplianceBadgeProps {
  title?: string;
  items: SectionContent[];
}

export default function ComplianceBadge({
  title = "The Compliance Guarantee",
  items,
}: ComplianceBadgeProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-6 text-navy">{title}</h3>
      <div className="grid gap-5 sm:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative border border-institutional-border rounded-sm p-5 bg-institutional-white"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-navy rounded-t-sm" />
            <h4 className="text-sm font-bold text-navy mb-2 mt-1">{item.heading}</h4>
            <p className="text-sm text-slate leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
