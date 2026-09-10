"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { SectionBand } from "@/components/ui/SectionBand";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useIsMobile } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";
import type { SectionProps } from "@/types/wedding";

export function Gallery({ data, className }: SectionProps) {
  const { gallery } = data;
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const isMobile = useIsMobile();

  const total = gallery.length;
  const usesEditorialGrid = [
    "editorial-hien-dai",
    "boho-dat-nung",
    "pastel-mau-nuoc",
    "olive-wax-seal",
  ].includes(data.theme.template);
  const prev = useCallback(
    () => setActive((i) => (i - 1 + total) % total),
    [total],
  );
  const next = useCallback(
    () => setActive((i) => (i + 1) % total),
    [total],
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  if (total === 0) return null;

  if (usesEditorialGrid) {
    return (
      <section className={`section-cream overflow-hidden py-0 ${className ?? ""}`}>
        <SectionBand title="Album ảnh cưới" />
        <div className="gallery-editorial-grid grid grid-cols-2 gap-2 p-4 sm:gap-4 sm:p-8">
          {gallery.map((img, index) => (
            <RevealOnScroll
              key={img.src}
              variant="fade-up"
              className={index % 3 === 0 ? "col-span-2" : ""}
            >
              <div
                className={`gallery-editorial-item relative overflow-hidden ${
                  index % 3 === 0 ? "aspect-[16/9]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt ?? `Ảnh cưới ${index + 1}`}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes={index % 3 === 0 ? "(max-width: 640px) 100vw, 720px" : "(max-width: 640px) 50vw, 350px"}
                />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    );
  }

  const getOffset = (index: number) => {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const centerW = isMobile ? 168 : 220;
  const centerH = isMobile ? 228 : 300;
  const sideW = isMobile ? 120 : 160;
  const sideH = isMobile ? 168 : 220;
  const slideGap = isMobile ? 88 : 130;

  return (
    <section className={`section-cream overflow-hidden py-0 ${className ?? ""}`}>
      <SectionBand title="Album ảnh cưới" />
      <RevealOnScroll variant="fade-scale">
        <div
          className="relative overflow-hidden px-2 py-8 sm:py-10"
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const diff = touchStart - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
          }}
        >
          <div
            className="relative mx-auto w-full max-w-lg perspective-[800px]"
            style={{ height: centerH + 40 }}
          >
            {gallery.map((img, i) => {
              const offset = getOffset(i);
              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);
              if (absOffset > 2) return null;

              const w = isCenter ? centerW : sideW;
              const h = isCenter ? centerH : sideH;

              return (
                <div
                  key={i}
                  className="gallery-slide"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: w,
                    height: h,
                    marginLeft: -w / 2,
                    marginTop: -h / 2,
                    transform: `translateX(${offset * slideGap}px) scale(${isCenter ? 1 : 0.75}) rotateY(${offset * (isMobile ? -18 : -25)}deg)`,
                    opacity: isCenter ? 1 : 0.5,
                    zIndex: 10 - absOffset,
                    filter: isCenter ? "none" : "brightness(0.7)",
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-lg shadow-xl">
                    <Image
                      src={img.src}
                      alt={img.alt ?? `Ảnh cưới ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 168px, 220px"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={prev}
            aria-label="Ảnh trước"
            className="absolute left-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-ink/60 shadow sm:left-2 sm:h-9 sm:w-9"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Ảnh sau"
            className="absolute right-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-ink/60 shadow sm:right-2 sm:h-9 sm:w-9"
          >
            ›
          </button>

          <div className="mt-3 flex justify-center gap-2">
            {gallery.map((_, i) => (
              <button
                key={i}
                aria-label={`Ảnh ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === active ? "w-6 bg-wine" : "w-2 bg-gold/50",
                )}
              />
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
