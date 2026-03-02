interface CaseStudyItem {
  title: string;
  description: string;
}

interface CaseStudyCardProps {
  title: string;
  items: CaseStudyItem[];
}

export default function CaseStudyCard({ title, items }: CaseStudyCardProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-6 text-navy">{title}</h3>
      <div className="space-y-4">
        {items.map((cs, i) => (
          <div
            key={i}
            className="flex gap-5 border border-institutional-border rounded-sm p-5 bg-institutional-off-white"
          >
            <span className="flex-none mt-0.5 text-xs font-mono font-bold text-slate-muted uppercase tracking-widest">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-navy mb-1">{cs.title}</h4>
              <p className="text-sm text-slate leading-relaxed">{cs.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
