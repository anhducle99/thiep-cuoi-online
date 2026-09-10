"use client";

import Image from "next/image";
import type { WeddingData } from "@/types/wedding";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  data: WeddingData;
  exiting?: boolean;
}

export function LoadingScreen({ data, exiting = false }: LoadingScreenProps) {
  const { groom, bride } = data;
  const isSongHy = data.theme.template === "song-hy-do";
  const emblem = {
    "olive-wax-seal": "❧",
    "holymaiden-rose": "💌",
    "luxury-gold-black": "⚜",
    "song-hy-do": "囍",
  }[data.theme.template];

  return (
    <section
      className={cn(
        "loading-screen fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 ease-out",
        exiting && "pointer-events-none opacity-0",
      )}
      aria-busy={!exiting}
      aria-label="Đang tải thiệp cưới"
    >
      <div
        className={cn(
          "flex flex-col items-center transition-all duration-700",
          exiting && "scale-95 opacity-0",
        )}
      >
        {/* Emblem xoay */}
        <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          {isSongHy && (
            <Image
              src="/images/themes/song-hy-red/sunburst.svg"
              alt=""
              width={112}
              height={112}
              className="absolute inset-0 animate-sunburst-spin opacity-80"
              aria-hidden
              priority
            />
          )}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-cream-btn/90 shadow-lg animate-emblem-glow sm:h-[4.5rem] sm:w-[4.5rem]">
            {isSongHy ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/themes/song-hy-red/chu-hy.webp" alt="" width={40} height={40} className="object-contain" />
            ) : (
              <span className="font-serif text-4xl text-wine">{emblem}</span>
            )}
          </div>
        </div>

        <p className="mt-6 font-display text-lg text-cream-btn/90 sm:text-xl">
          {groom.shortName}
          <span className="mx-2 font-script text-gold-light">&amp;</span>
          {bride.shortName}
        </p>

        <p className="mt-2 font-serif text-xs tracking-[0.35em] text-cream-btn/50">
          ĐANG MỞ THIỆP
        </p>

        {/* Thanh tiến trình */}
        <div className="mt-8 h-0.5 w-36 overflow-hidden rounded-full bg-white/10 sm:w-44">
          <div className="loading-bar h-full rounded-full bg-gradient-to-r from-gold/40 via-gold-light to-gold/40" />
        </div>
      </div>
    </section>
  );
}
