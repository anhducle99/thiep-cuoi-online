"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useGuestName } from "@/components/GuestNameProvider";
import type { SectionProps } from "@/types/wedding";

export function WelcomeHero({ data, className }: SectionProps) {
  const { groom, bride, welcomeText } = data;
  const { guestName } = useGuestName();
  const photo = groom.photo ?? bride.photo;
  const emblem = {
    "olive-wax-seal": "❧",
    "holymaiden-rose": "💌",
    "luxury-gold-black": "⚜",
    "song-hy-do": "囍",
  }[data.theme.template];

  return (
    <section className={`welcome-hero relative overflow-hidden bg-cream-light pb-10 pt-0 ${className ?? ""}`}>
      {/* Vòm đỏ phía trên */}
      <div className="welcome-hero__dome" aria-hidden />

      <div className="relative z-10 px-4 pt-10 text-center sm:pt-12">
        {guestName && (
          <RevealOnScroll variant="blur-up">
            <p className="mb-4 font-serif text-sm text-cream-light/95 sm:text-base">
              Trân trọng kính mời{" "}
              <span className="font-semibold text-gold-light">{guestName}</span>
            </p>
          </RevealOnScroll>
        )}
        <RevealOnScroll variant="blur-up">
          <p className="font-classic text-[0.65rem] uppercase tracking-[0.45em] text-cream-light/95 sm:text-xs">
            {welcomeText ?? "Welcome to our wedding"}
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-scale" delay={80}>
          <p className="welcome-hero__hy mt-4 font-serif text-5xl text-cream-light sm:text-6xl">
            {emblem}
          </p>
        </RevealOnScroll>

        {/* Tên hai bên */}
        <RevealOnScroll variant="fade-up" delay={160}>
          <div className="mt-5 flex items-end justify-center gap-3 sm:gap-6">
            <div className="flex-1 text-right">
              <p className="font-classic text-[0.6rem] uppercase tracking-[0.25em] text-cream-light/80 sm:text-[0.65rem]">
                {groom.title}
              </p>
              <p className="font-display text-sm font-semibold uppercase leading-tight text-cream-light sm:text-base">
                {groom.shortName}
              </p>
            </div>
            <span className="font-display pb-1 text-lg text-gold-light sm:text-xl">{emblem}</span>
            <div className="flex-1 text-left">
              <p className="font-classic text-[0.6rem] uppercase tracking-[0.25em] text-cream-light/80 sm:text-[0.65rem]">
                {bride.title}
              </p>
              <p className="font-display text-sm font-semibold uppercase leading-tight text-cream-light sm:text-base">
                {bride.shortName}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Khung ảnh cung + chữ cong */}
      <div className="relative z-10 mt-8 flex flex-col items-center px-4">
        <RevealOnScroll variant="fade-up" delay={240}>
          <div className="welcome-arch-label">
            <span className="welcome-arch-label__star">✦</span>
            <span className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-wine sm:text-xs">
              Love never fails
            </span>
            <span className="welcome-arch-label__star">✦</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-scale" delay={320}>
          <div className="welcome-arch-frame mt-3">
            {photo ? (
              <Image
                src={photo}
                alt={`${groom.shortName} & ${bride.shortName}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 75vw, 280px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-wine/10 font-serif text-wine/40">
                Ảnh cưới
              </div>
            )}
            <div className="welcome-arch-frame__fade" aria-hidden />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
