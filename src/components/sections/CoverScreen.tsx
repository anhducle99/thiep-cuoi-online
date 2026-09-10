"use client";

import Image from "next/image";
import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import { DoubleHappinessField } from "@/components/decor/DoubleHappiness";
import { SparkleField } from "@/components/decor/SparkleField";
import { useGuestName } from "@/components/GuestNameProvider";
import type { SectionProps } from "@/types/wedding";
import { cn } from "@/lib/utils";

interface CoverScreenProps extends SectionProps {
  onOpen?: () => void;
  isOpening?: boolean;
}

export function CoverScreen({
  data,
  onOpen,
  isOpening = false,
  className,
}: CoverScreenProps) {
  const { groom, bride, reception } = data;
  const { guestName } = useGuestName();
  const monthNum = parseInt(reception.date.month, 10);
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
        "cover-gradient fixed inset-0 z-40 flex items-center justify-center",
        isOpening && "cover-exit pointer-events-none",
        className,
      )}
    >
      <DoubleHappinessField isOpening={isOpening} />
      <SparkleField intense={isOpening} />

      {isOpening && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="cover-burst-ring h-[min(80vw,24rem)] w-[min(80vw,24rem)] rounded-full animate-burst-ring" />
          <div className="absolute inset-0 bg-gradient-to-b from-gold-light/20 via-cream-btn/10 to-transparent animate-burst-flash" />
        </div>
      )}

      <div
        className={cn(
          "relative z-10 mx-4 w-full max-w-sm sm:mx-6",
          isOpening ? "cover-card-exit" : "cover-card-enter",
        )}
      >
        <div
          className={cn(
            "cover-card relative overflow-hidden rounded-2xl px-4 pb-8 pt-14 text-center shadow-2xl sm:px-6 sm:pb-10 sm:pt-16",
            !isOpening && "animate-pulse-glow",
          )}
          style={{ background: "var(--cover-card)" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -left-4 top-8 select-none font-serif text-[120px] leading-none text-white/5"
          >
            囍
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 bottom-8 select-none font-serif text-[120px] leading-none text-white/5"
          >
            囍
          </span>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,238,210,0.15) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 4s linear infinite",
            }}
          />

          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
            {isSongHy && (
              <Image
                src="/images/themes/song-hy-red/sunburst.svg"
                alt=""
                width={96}
                height={96}
                className="absolute inset-0 opacity-90 animate-sunburst-spin"
                aria-hidden
                priority
              />
            )}
            <div className="cover-emblem relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-cream-btn shadow-lg animate-emblem-glow sm:h-16 sm:w-16">
              {isSongHy ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/themes/song-hy-red/chu-hy.webp"
                  alt="Song Hỷ"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              ) : (
                <span className="font-serif text-3xl text-wine">{emblem}</span>
              )}
            </div>
          </div>

          <h1 className="font-display text-[clamp(1.5rem,6vw,2.25rem)] leading-snug text-cream-btn text-shadow-glow">
            {groom.shortName}
            <span className="mx-2 font-script text-3xl text-gold-light sm:text-4xl">&amp;</span>
            {bride.shortName}
          </h1>

          <OrnamentDivider />

          <p className="font-serif text-base text-cream-btn/90">
            {reception.date.day} tháng {monthNum}, {reception.date.year}
          </p>
          <p className="mt-2 font-serif tracking-[0.3em] text-cream-btn/80">
            {guestName ? `Thân mời ${guestName}` : "Thân Mời"}
          </p>

          <button
            className={cn(
              "btn-open-envelope mt-8 transition-opacity duration-300",
              isOpening && "pointer-events-none opacity-0",
            )}
            onClick={onOpen}
            disabled={isOpening}
          >
            Mở thiệp
          </button>
        </div>
      </div>
    </section>
  );
}
