import type { DirectorateContent } from "@/content/pages";

interface DirectorateListProps {
  items: DirectorateContent[];
}

export default function DirectorateList({ items }: DirectorateListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 mt-8">
      {items.map((d, i) => (
        <div
          key={i}
          className="border border-institutional-border rounded-sm p-6 bg-institutional-off-white hover:border-navy/30 transition-colors"
        >
          <div className="flex items-start gap-4">
            <span className="flex-none flex items-center justify-center w-9 h-9 rounded-sm bg-navy text-institutional-white text-sm font-bold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold mb-1.5">{d.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{d.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
