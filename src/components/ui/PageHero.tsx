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
    <div className="relative bg-navy text-institutional-white overflow-hidden">
      {hasImage && (
        <>
          <Image
            src={imageSrc as string}
            alt={imageAlt ?? ""}
            fill
            className="object-cover object-center opacity-60"
            sizes="(max-width: 1024px) 100vw, 1280px"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-navy/55" />
        </>
      )}

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="max-w-3xl">
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
