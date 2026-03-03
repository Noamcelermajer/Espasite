import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function PageHero({ title, subtitle, imageSrc, imageAlt }: PageHeroProps) {
  const hasImage = Boolean(imageSrc);

  return (
    <div className="bg-navy text-institutional-white">
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        {hasImage && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-sm">
            <Image
              src={imageSrc as string}
              alt={imageAlt ?? ""}
              fill
              className="object-cover object-center opacity-35"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-navy/70" />
          </div>
        )}

        <div className="relative max-w-3xl">
          <h1 className="text-institutional-white text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-lg text-institutional-white/80 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
