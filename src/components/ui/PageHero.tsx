import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function PageHero({ title, subtitle, imageSrc, imageAlt }: PageHeroProps) {
  return (
    <div className="bg-navy text-institutional-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
        <div>
          <h1 className="text-institutional-white text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-lg text-institutional-white/70 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {imageSrc && (
          <div className="relative h-48 md:h-56 lg:h-64 rounded-sm overflow-hidden border border-institutional-border/40 bg-institutional-off-white/5">
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 320px, 100vw"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
