interface SectionBlockProps {
  heading: string;
  children: React.ReactNode;
  as?: "h2" | "h3";
  className?: string;
}

export default function SectionBlock({
  heading,
  children,
  as: Tag = "h2",
  className = "",
}: SectionBlockProps) {
  return (
    <section className={`py-10 ${className}`}>
      <Tag className="mb-4 text-xl font-bold text-navy border-l-4 rtl:border-l-0 rtl:border-r-4 border-navy pl-4 rtl:pl-0 rtl:pr-4">
        {heading}
      </Tag>
      <div className="text-slate leading-relaxed">{children}</div>
    </section>
  );
}
