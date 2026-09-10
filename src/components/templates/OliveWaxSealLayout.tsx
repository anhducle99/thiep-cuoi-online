"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { WeddingData, Wish } from "@/types/wedding";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useGuestName } from "@/components/GuestNameProvider";
import { useMusicOptional } from "@/components/MusicProvider";
import { getCountdown, type CountdownParts, cn } from "@/lib/utils";

function isDefaultStock(src?: string) {
  return !src || src.includes("DSC0") || src.includes("Album");
}

function HeroHeader({ data }: { data: WeddingData }) {
  const rawPhoto = data.groom.photo ?? data.gallery[0]?.src;
  const photo = isDefaultStock(rawPhoto) ? "/templates/olive/demo/hero.webp" : rawPhoto;
  const date = data.reception.date;

  return (
    <section className="relative w-full h-[100vh] min-h-[640px] max-h-[920px] overflow-hidden bg-stone-900 select-none">
      {photo && (
        <Image
          src={photo}
          alt={`${data.groom.shortName} & ${data.bride.shortName}`}
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 640px) 100vw, 575px"
        />
      )}
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

      {/* Hero content */}
      <div className="absolute inset-x-0 bottom-12 z-10 px-6 text-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
        <RevealOnScroll variant="blur-up">
          <p
            className="text-[clamp(68px,16vw,100px)] leading-[0.85] text-amber-50 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            style={{ fontFamily: "var(--font-high-spirited), cursive" }}
          >
            Save the date
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delay={150}>
          <h1
            className="mt-4 text-[clamp(22px,5.5vw,32px)] font-bold uppercase tracking-[0.08em] text-white"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            {data.groom.shortName} - {data.bride.shortName}
          </h1>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delay={250}>
          <p
            className="mt-2 text-[clamp(16px,4vw,20px)] tracking-widest text-white/90 font-light"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            {date.day}.{date.month}.{date.year}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <section className="relative w-full bg-[#27321c] pt-16 pb-8 px-6 text-center text-white overflow-hidden">
      {/* Decorative botanical branch */}
      <div className="absolute -right-8 -top-8 w-44 h-44 opacity-85 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/olive/decor-flower1.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      <RevealOnScroll variant="blur-up">
        <h2
          className="text-[clamp(24px,5.8vw,34px)] font-bold tracking-wide uppercase leading-tight text-white max-w-[420px] mx-auto"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          When two hearts
          <br />
          beat as one
        </h2>
      </RevealOnScroll>

      <div className="my-5 flex items-center justify-center">
        <span className="h-[2px] w-20 bg-stone-300/40" />
      </div>

      <RevealOnScroll variant="fade-up" delay={150}>
        <p
          className="text-[clamp(16px,4vw,22px)] leading-relaxed text-stone-200 font-medium max-w-[420px] mx-auto"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          They create a soul strong
          <br />
          enough to last forever!
        </p>
      </RevealOnScroll>
    </section>
  );
}

function CoupleProfiles({ data }: { data: WeddingData }) {
  const groomPhoto = isDefaultStock(data.groom.photo)
    ? "/templates/olive/demo/groom.webp"
    : (data.groom.photo ?? data.gallery[0]?.src);
  const bridePhoto = isDefaultStock(data.bride.photo)
    ? "/templates/olive/demo/bride.webp"
    : (data.bride.photo ?? data.gallery[1]?.src ?? data.gallery[0]?.src);

  return (
    <section className="relative w-full bg-[#27321c] pt-2 pb-16 px-5 text-center text-white overflow-hidden">
      {/* Decorative leaf branch on the left (absolute overlay, does not push layout flow) */}
      <div className="absolute -left-16 sm:-left-24 top-[40%] w-52 sm:w-64 pointer-events-none z-20 select-none opacity-85 -rotate-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/olive/decor-flower02.png"
          alt=""
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Groom Card */}
      {groomPhoto && (
        <RevealOnScroll variant="fade-up">
          <div className="relative mx-auto w-full max-w-[480px] h-[520px] sm:h-[540px] rounded-[20px] overflow-hidden shadow-2xl">
            <Image
              src={groomPhoto}
              alt={`Chú rể ${data.groom.fullName}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 92vw, 480px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-8 z-10 px-4">
              <p
                className="text-[clamp(46px,11vw,62px)] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] leading-none"
                style={{ fontFamily: "var(--font-arcittya), cursive" }}
              >
                Chú rể
              </p>
              <p
                className="mt-2 text-[clamp(20px,5vw,28px)] font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                {data.groom.fullName}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Bride Card - closely spaced to Groom (~36px-40px matching MiuWedding) */}
      {bridePhoto && (
        <div className="mt-8 sm:mt-10">
          <RevealOnScroll variant="fade-up">
            <div className="relative mx-auto w-full max-w-[480px] h-[520px] sm:h-[540px] rounded-[20px] overflow-hidden shadow-2xl">
              <Image
                src={bridePhoto}
                alt={`Cô dâu ${data.bride.fullName}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 92vw, 480px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-8 z-10 px-4">
                <p
                  className="text-[clamp(46px,11vw,62px)] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] leading-none"
                  style={{ fontFamily: "var(--font-arcittya), cursive" }}
                >
                  Cô dâu
                </p>
                <p
                  className="mt-2 text-[clamp(20px,5vw,28px)] font-bold uppercase tracking-wider text-white"
                  style={{ fontFamily: "var(--font-lora), serif" }}
                >
                  {data.bride.fullName}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      )}
    </section>
  );
}

function getInitial(name: string, fallback: string = ""): string {
  const parts = name.trim().split(/\s+/);
  const mainName = parts[parts.length - 1] || "";
  return (mainName[0] || fallback).toUpperCase();
}

function FamilyInvitation({ data }: { data: WeddingData }) {
  const { guestName } = useGuestName();
  const groomInitial = getInitial(data.groom.fullName || data.groom.shortName, "T");
  const brideInitial = getInitial(data.bride.fullName || data.bride.shortName, "H");

  return (
    <section className="relative w-full bg-[#f8f8f4] pt-14 pb-4 px-5 text-center text-[#4e6437] overflow-hidden">
      <div className="max-w-[480px] mx-auto">
        {/* Parents columns - centered, spacious, clean, NO dividing lines */}
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-2 gap-4 text-center max-w-[420px] mx-auto">
            {/* Nhà Trai */}
            <div>
              <h3
                className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#4e6437] mb-2"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                NHÀ TRAI
              </h3>
              <p
                className="text-[14px] sm:text-[15px] font-normal text-[#4e6437] leading-relaxed"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                Ông: {data.groomParents.father}
              </p>
              <p
                className="text-[14px] sm:text-[15px] font-normal text-[#4e6437] leading-relaxed"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                Bà: {data.groomParents.mother}
              </p>
            </div>

            {/* Nhà Gái */}
            <div>
              <h3
                className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#4e6437] mb-2"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                NHÀ GÁI
              </h3>
              <p
                className="text-[14px] sm:text-[15px] font-normal text-[#4e6437] leading-relaxed"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                Ông: {data.brideParents.father}
              </p>
              <p
                className="text-[14px] sm:text-[15px] font-normal text-[#4e6437] leading-relaxed"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                Bà: {data.brideParents.mother}
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Monogram Seal in Center */}
        <div className="relative my-7 mx-auto w-[180px] h-[220px] flex items-center justify-center select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/templates/olive/signature-bg.png"
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
          {/* Groom initial top-left in serif Playfair Display */}
          <span
            className="absolute top-5 right-[50%] text-[72px] leading-none text-[#4e6437]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}
          >
            {groomInitial}
          </span>
          {/* Bride initial bottom-right in UVN Hoa Tay script */}
          <span
            className="absolute top-16 left-[44%] text-[66px] leading-none text-[#4e6437]"
            style={{ fontFamily: "'UVN Hoa Tay', cursive", fontWeight: 400 }}
          >
            {brideInitial}
          </span>
        </div>

        {/* Invitation Text */}
        <RevealOnScroll variant="fade-up">
          <p
            className="text-[19px] sm:text-[21px] font-normal text-[#4e6437]"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Trân trọng kính mời
          </p>

          <p
            className="mt-1 text-[22px] sm:text-[25px] font-normal italic text-[#4e6437]"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            {guestName ?? "Quý khách"}
          </p>

          {/* Dashed line matching screenshot */}
          <div className="border-b border-dashed border-[#4e6437]/60 w-[240px] sm:w-[280px] mx-auto my-2.5" />

          <p
            className="text-[16px] sm:text-[18px] font-normal text-[#4e6437] leading-relaxed"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Tham dự bữa tiệc chung vui cùng gia đình!
          </p>

          {/* Vertical dividing bar */}
          <div className="w-[1.5px] h-8 bg-[#4e6437] mx-auto my-6" />

          {/* Couple Names matching screenshot */}
          <div className="flex flex-col items-center">
            <p
              className="text-[26px] sm:text-[32px] font-normal uppercase tracking-[0.06em] text-[#4e6437]"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {data.groom.fullName}
            </p>

            <p
              className="text-[82px] sm:text-[96px] text-[#4e6437] leading-[0.7] my-1 select-none"
              style={{ fontFamily: "'Flavinda', var(--font-flavinda), cursive", fontWeight: 400 }}
            >
              and
            </p>

            <p
              className="text-[26px] sm:text-[32px] font-normal uppercase tracking-[0.06em] text-[#4e6437]"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {data.bride.fullName}
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function EventDetails({ data }: { data: WeddingData }) {
  const event = data.reception;
  const date = event.date;

  return (
    <section className="relative w-full bg-[#f8f8f4] pb-16 px-6 text-center text-[#4e6437]">
      <div className="max-w-[480px] mx-auto pt-6">
        {/* Oval Badge */}
        <RevealOnScroll variant="fade-scale">
          <div className="inline-block rounded-full bg-[#4e6437] px-9 py-2.5 text-white shadow-md">
            <span
              className="text-base sm:text-lg font-bold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {data.ceremony.label ?? "LỄ THÀNH HÔN"}
            </span>
          </div>
        </RevealOnScroll>

        {/* 3-Column Date Box */}
        <RevealOnScroll variant="fade-up" delay={150}>
          <div
            className="my-8 mx-auto grid grid-cols-3 items-center gap-2 max-w-[390px] text-[#4e6437]"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            {/* Left: Time */}
            <div className="text-right pr-2">
              <span className="text-[26px] sm:text-[30px] font-light">
                {date.time}
              </span>
            </div>

            {/* Center: Vertical Day / Month / Year */}
            <div className="flex flex-col items-center border-x border-[#4e6437]/50 px-4 leading-tight">
              <span className="text-[44px] sm:text-[56px] font-light leading-[0.9]">
                {date.day}
              </span>
              <span className="text-[44px] sm:text-[56px] font-light leading-[0.9]">
                {date.month}
              </span>
              <span className="text-[44px] sm:text-[56px] font-light leading-[0.9]">
                {date.year.slice(-2)}
              </span>
            </div>

            {/* Right: Weekday */}
            <div className="text-left pl-2">
              <span className="text-[22px] sm:text-[26px] font-light uppercase">
                {date.weekday}
              </span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Lunar Date */}
        {date.lunar && (
          <RevealOnScroll variant="fade-up">
            <p
              className="text-[19px] sm:text-[22px] italic text-[#4e6437] font-normal my-2"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              ({date.lunar})
            </p>
          </RevealOnScroll>
        )}

        {/* Venue Info */}
        <RevealOnScroll variant="fade-up" delay={100}>
          <div className="mt-8 space-y-2">
            <p
              className="text-[20px] sm:text-[22px] text-[#4e6437] font-normal"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              Địa điểm
            </p>
            <h3
              className="text-[26px] sm:text-[32px] font-bold uppercase text-[#4e6437] leading-[1.3] whitespace-pre-line tracking-wide"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {event.venueName}
            </h3>
            <p
              className="text-[18px] sm:text-[21px] text-[#4e6437] max-w-[460px] mx-auto italic font-normal pt-1"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {event.address}
            </p>
          </div>
        </RevealOnScroll>

        {/* Google Map Directions Button - Borderless with Map Pin Icon matching reference */}
        {event.mapUrl && (
          <RevealOnScroll variant="fade-up" delay={200}>
            <div className="mt-8 mb-2">
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 text-[23px] sm:text-[26px] font-bold uppercase tracking-wider text-[#4e6437] hover:opacity-75 transition-opacity"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                <svg
                  className="w-7 h-7 stroke-[#4e6437] fill-none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                    fill="#4e6437"
                  />
                </svg>
                <span>CHỈ ĐƯỜNG</span>
              </a>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}

function CalendarAndCountdown({ data }: { data: WeddingData }) {
  const date = data.reception.date;
  const weddingDay = parseInt(date.day, 10);
  const year = parseInt(date.year, 10);
  const month = parseInt(date.month, 10);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthName = monthNames[month - 1] ?? "Wedding";

  const [countdown, setCountdown] = useState<CountdownParts>(() =>
    getCountdown(date.iso),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(date.iso));
    }, 1000);
    return () => clearInterval(timer);
  }, [date.iso]);

  const firstDayIndex = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const bannerPhoto = isDefaultStock(data.gallery[2]?.src)
    ? "/templates/olive/demo/just-married.webp"
    : (data.gallery[2]?.src ?? data.gallery[0]?.src);

  return (
    <section className="relative w-full bg-[#f8f8f4] pb-16 px-5 text-center text-[#4e6437] overflow-hidden">
      {/* Decorative leaf branch left */}
      <div className="absolute left-0 top-[380px] w-28 h-auto pointer-events-none opacity-80 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/olive/decor-flower4.png"
          alt=""
          className="w-full h-auto object-contain -translate-x-3"
        />
      </div>

      {/* Decorative leaf branch right */}
      <div className="absolute right-0 bottom-12 w-24 h-auto pointer-events-none opacity-80 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/olive/decor-flower3.png"
          alt=""
          className="w-full h-auto object-contain translate-x-3"
        />
      </div>

      {/* Banner Just Married */}
      {bannerPhoto && (
        <RevealOnScroll variant="fade-up">
          <div className="relative mx-auto w-full max-w-[500px] h-[320px] sm:h-[360px] rounded-[18px] overflow-hidden shadow-xl mb-12">
            <Image
              src={bannerPhoto}
              alt="Just Married"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute right-6 bottom-6 z-10 text-right text-white select-none">
              <span
                className="block text-[62px] sm:text-[72px] leading-none"
                style={{ fontFamily: "'Flavinda', var(--font-flavinda), cursive" }}
              >
                Just
              </span>
              <span
                className="block text-[48px] sm:text-[58px] font-normal uppercase tracking-wider leading-none text-[#f5f5f5]"
                style={{ fontFamily: "'Ergisa-Regular', var(--font-ergisa), cursive" }}
              >
                MARRIED
              </span>
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Year & Month script title */}
      <RevealOnScroll variant="fade-up">
        <div className="max-w-[420px] mx-auto text-[#4e6437] relative z-10">
          <p
            className="text-[86px] sm:text-[100px] font-normal leading-none"
            style={{ fontFamily: "'Ergisa-Regular', var(--font-ergisa), cursive" }}
          >
            {year}
          </p>
          <p
            className="text-[80px] sm:text-[95px] leading-none -mt-6 sm:-mt-8 text-[#4e6437]"
            style={{ fontFamily: "var(--font-high-spirited), cursive" }}
          >
            {monthName}
          </p>

          {/* Calendar Grid */}
          <div className="mt-8 border-t border-b border-[#4e6437]/25 py-4">
            <div
              className="grid grid-cols-7 gap-1 text-xs sm:text-sm font-semibold uppercase text-[#4e6437]/80 pb-2"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              <span>Th 2</span>
              <span>Th 3</span>
              <span>Th 4</span>
              <span>Th 5</span>
              <span>Th 6</span>
              <span>Th 7</span>
              <span>CN</span>
            </div>

            <div
              className="grid grid-cols-7 gap-1 text-base sm:text-lg font-medium text-[#4e6437]"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {calendarCells.map((d, idx) => {
                if (d === null) {
                  return <div key={`empty-${idx}`} className="h-10" />;
                }
                const isWeddingDay = d === weddingDay;

                return (
                  <div
                    key={`day-${d}`}
                    className="h-10 flex items-center justify-center relative"
                  >
                    {isWeddingDay ? (
                      <div className="relative w-9 h-9 flex items-center justify-center">
                        {/* Green heart icon badge */}
                        <svg
                          className="absolute inset-0 w-full h-full text-[#4e6437] fill-current animate-pulse"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="relative z-10 text-xs sm:text-sm font-bold text-white">
                          {d}
                        </span>
                      </div>
                    ) : (
                      <span className="opacity-95">{d}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Countdown timer */}
          <div className="mt-8">
            <p
              className="text-[20px] sm:text-[24px] text-[#4e6437] leading-[1.3] font-normal"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              We’ll be sharing a home and a life
              <br />
              together in
            </p>

            <div
              className="mt-4 flex items-center justify-center gap-2 sm:gap-3 text-[#4e6437] font-light text-[26px] sm:text-[36px]"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {countdown.isPast ? (
                <span className="font-semibold text-lg uppercase tracking-wider text-[#4e6437]">
                  Today is our wedding day!
                </span>
              ) : (
                <div className="flex items-center gap-2 font-light">
                  <span>{String(countdown.days).padStart(2, "0")} d</span>
                  <span>:</span>
                  <span>{String(countdown.hours).padStart(2, "0")} h</span>
                  <span>:</span>
                  <span>{String(countdown.minutes).padStart(2, "0")} m</span>
                  <span>:</span>
                  <span>{String(countdown.seconds).padStart(2, "0")} s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

function TimelineSection({ data }: { data: WeddingData }) {
  const bgPhoto = isDefaultStock(data.gallery[3]?.src)
    ? "/templates/olive/demo/timeline-bg.webp"
    : (data.gallery[3]?.src ?? data.gallery[0]?.src);
  const schedule = data.schedule.slice(0, 4);

  const iconList = [
    "/templates/olive/icon-tl2.png",
    "/templates/olive/icon-tl3.png",
    "/templates/olive/icon-tl4.png",
    "/templates/olive/icon-tl2.png",
  ];

  return (
    <section className="relative w-full min-h-[580px] overflow-hidden bg-stone-900 py-16 px-5 text-white text-center">
      {bgPhoto && (
        <Image
          src={bgPhoto}
          alt="Timeline"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 575px"
        />
      )}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative z-10 max-w-[460px] mx-auto">
        <RevealOnScroll variant="blur-up">
          <h2
            className="text-[76px] sm:text-[90px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-none"
            style={{ fontFamily: "var(--font-high-spirited), cursive" }}
          >
            Timeline
          </h2>
        </RevealOnScroll>

        {/* Timeline items matching MiuWedding */}
        <div className="mt-10 space-y-6">
          {schedule.map((item, idx) => (
            <RevealOnScroll key={`${item.time}-${idx}`} variant="fade-up" delay={idx * 100}>
              <div className="flex items-center gap-3 text-left">
                {/* Timeline Icon */}
                <div className="relative w-16 h-14 shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={iconList[idx % iconList.length]}
                    alt=""
                    className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Divider bar */}
                <span className="text-white/80 select-none text-xl">_______</span>

                {/* Time & Activity */}
                <div className="flex-1 pl-1">
                  <span
                    className="text-[24px] sm:text-[28px] font-normal text-white"
                    style={{ fontFamily: "var(--font-lora), serif" }}
                  >
                    {item.time}
                  </span>
                  <p
                    className="text-[17px] sm:text-[19px] text-white/95 font-normal whitespace-pre-line leading-snug mt-0.5"
                    style={{ fontFamily: "var(--font-lora), serif" }}
                  >
                    {item.activity}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemoriesGallery({ data }: { data: WeddingData }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const isDefault = data.gallery.length === 0 || data.gallery.some((p) => isDefaultStock(p.src));
  const galleryPhotos = isDefault
    ? [
        { src: "/templates/olive/demo/g1.webp", alt: "Kỷ niệm 1" },
        { src: "/templates/olive/demo/g2.webp", alt: "Kỷ niệm 2" },
        { src: "/templates/olive/demo/g3.webp", alt: "Kỷ niệm 3" },
        { src: "/templates/olive/demo/g4.webp", alt: "Kỷ niệm 4" },
        { src: "/templates/olive/demo/g5.webp", alt: "Kỷ niệm 5" },
        { src: "/templates/olive/demo/g6.webp", alt: "Kỷ niệm 6" },
        { src: "/templates/olive/demo/g7.webp", alt: "Kỷ niệm 7" },
        { src: "/templates/olive/demo/g8.webp", alt: "Kỷ niệm 8" },
      ]
    : data.gallery;

  const triptychPhoto =
    data.triptychPhoto ||
    (data.gallery?.[0]?.src && !isDefaultStock(data.gallery[0].src)
      ? data.gallery[0].src
      : "/templates/olive/demo/triptych.webp");

  return (
    <section className="relative w-full bg-[#f8f8f4] py-14 px-4 text-center text-[#4e6437]">
      {/* 3-panel panoramic triptych matching MiuWedding */}
      <RevealOnScroll variant="fade-up">
        <div className="mx-auto w-full max-w-[500px] h-[260px] sm:h-[300px] flex items-stretch gap-3 mb-12 px-1">
          <div className="flex-1 overflow-hidden rounded-md relative shadow-md">
            <div
              className="w-full h-full bg-cover"
              style={{
                backgroundImage: `url('${triptychPhoto}')`,
                backgroundSize: "300% auto",
                backgroundPosition: "0% 50%",
              }}
            />
          </div>
          <div className="flex-1 overflow-hidden rounded-md relative shadow-xl transform scale-[1.08] z-10">
            <div
              className="w-full h-full bg-cover"
              style={{
                backgroundImage: `url('${triptychPhoto}')`,
                backgroundSize: "300% auto",
                backgroundPosition: "50% 50%",
              }}
            />
          </div>
          <div className="flex-1 overflow-hidden rounded-md relative shadow-md">
            <div
              className="w-full h-full bg-cover"
              style={{
                backgroundImage: `url('${triptychPhoto}')`,
                backgroundSize: "300% auto",
                backgroundPosition: "100% 50%",
              }}
            />
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll variant="blur-up">
        <h2
          className="text-[72px] sm:text-[84px] text-[#4e6437] leading-none mb-8"
          style={{ fontFamily: "var(--font-high-spirited), cursive" }}
        >
          Our Memories
        </h2>
      </RevealOnScroll>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-2.5 max-w-[500px] mx-auto [grid-auto-flow:dense]">
        {galleryPhotos.map((photo, idx) => {
          const total = galleryPhotos.length;
          const completeGroupsLimit = total - (total % 3);
          const isCompleteGroup = idx < completeGroupsLimit;
          let spanClass = "";

          if (isCompleteGroup) {
            if (idx % 6 === 0) spanClass = "row-span-2 col-start-1";
            else if (idx % 6 === 3) spanClass = "row-span-2 col-start-2";
          } else if (total % 3 === 1 && idx === total - 1) {
            spanClass = "col-span-2 aspect-[16/9]";
          }

          return (
            <RevealOnScroll
              key={`${photo.src}-${idx}`}
              variant="fade-scale"
              delay={(idx % 4) * 80}
              className={spanClass}
            >
              <div
                onClick={() => setSelectedPhoto(photo.src)}
                className={cn(
                  "relative w-full h-full min-h-[170px] sm:min-h-[220px] rounded-xl overflow-hidden shadow-md cursor-pointer group",
                  spanClass.includes("aspect-[16/9]") && "min-h-[220px] sm:min-h-[260px]",
                )}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt ?? `Ảnh cưới ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 46vw, 240px"
                />
              </div>
            </RevealOnScroll>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[15000] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-full max-h-full w-[90vw] h-[80vh]">
            <Image
              src={selectedPhoto}
              alt="Ảnh cưới xem lớn"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function GuestbookSection() {
  const { guestName } = useGuestName();
  const [name, setName] = useState(guestName ?? "");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (guestName) setName(guestName);
  }, [guestName]);

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then((d) => setWishes(d.wishes ?? []))
      .catch(() => {});
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus("Vui lòng nhập tên và lời chúc.");
      return;
    }
    setSubmitting(true);
    setStatus("");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          invitedAs: guestName ?? undefined,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error);
      setWishes((prev) => [resData.wish, ...prev]);
      setMessage("");
      setStatus("Cảm ơn bạn đã gửi lời chúc ý nghĩa!");
    } catch {
      setStatus("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full bg-[#f8f8f4] py-14 px-5 text-center text-[#4e6437] border-t border-[#4e6437]/10 overflow-hidden">
      {/* Background floral watermark in corner */}
      <div className="absolute left-0 top-0 w-36 h-auto pointer-events-none opacity-60 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/olive/decor-flower4.png"
          alt=""
          className="w-full h-auto object-contain -translate-x-4 -translate-y-4"
        />
      </div>

      <div className="relative z-10 max-w-[460px] mx-auto">
        <RevealOnScroll variant="fade-up">
          <h2
            className="text-[clamp(44px,9vw,60px)] leading-none text-[#4e6437]"
            style={{ fontFamily: "var(--font-high-spirited), cursive" }}
          >
            Sổ lưu bút
          </h2>
          <p
            className="mt-2.5 text-sm sm:text-base text-[#4e6437]/90 leading-relaxed font-normal"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Cảm ơn bạn rất nhiều vì đã gửi những lời chúc mừng tốt đẹp nhất đến
            đám cưới của chúng tôi!
          </p>
        </RevealOnScroll>

        {/* Form box with sage green background matching screenshot 3 */}
        <RevealOnScroll variant="fade-up" delay={120}>
          <div className="mt-6 rounded-2xl bg-[#c8d2be] p-4 sm:p-5 shadow-sm">
            <form onSubmit={handleSend} className="space-y-3 text-left">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn*"
                className="w-full rounded-xl bg-white border-0 px-4 py-3 text-sm text-[#333] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4e6437] shadow-sm"
              />

              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập lời chúc của bạn*"
                className="w-full rounded-xl bg-white border-0 px-4 py-3 text-sm text-[#333] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4e6437] shadow-sm resize-none"
              />

              {status && (
                <p className="text-xs text-[#4e6437] font-semibold text-center pt-1">
                  {status}
                </p>
              )}

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="mx-auto block rounded-full bg-[#4e6437] px-8 py-2.5 text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#3d502a] active:scale-95 transition-all"
                  style={{ fontFamily: "var(--font-lora), serif" }}
                >
                  {submitting ? "Đang gửi..." : "Gửi lời chúc"}
                </button>
              </div>
            </form>
          </div>
        </RevealOnScroll>

        {/* Wishes List Card matching screenshot 3 */}
        <div className="mt-4 rounded-2xl bg-white border border-[#4e6437]/15 p-4 shadow-sm text-left">
          <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
            {(wishes.length > 0
              ? wishes
              : [
                  {
                    id: "demo-1",
                    name: "HAU KIU",
                    message:
                      "Chúc mừng hạnh phúc em iuu! Chúc từ hôm nay đến mãi về sau lúc nào cũng yêu thương, thấu hiểu và đồng hành cùng nhau. Mong mọi điều tốt đẹp nhất sẽ luôn đến với gia đình nhỏ của hai em.",
                  },
                  {
                    id: "demo-2",
                    name: "Mai Trang",
                    message:
                      "Chúc mừng hạnh phúc cô bạn thân của mình. Hơi tiếc nuối là ở xa không dự được lễ cưới hay phụ giúp cho bạn được nhiều. Chúc 2 vợ chồng trăm năm hạnh phúc!",
                  },
                ]
            ).map((w, i) => (
              <div
                key={w.id ?? i}
                className="border-b border-stone-200/60 pb-3 last:border-b-0 last:pb-0"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#4e6437]">
                  {w.name}
                </p>
                <p
                  className="text-sm text-[#333] mt-1 leading-relaxed"
                  style={{ fontFamily: "var(--font-lora), serif" }}
                >
                  {w.message}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center pt-3 border-t border-stone-200/50 mt-2">
            <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
              Xem thêm lời chúc ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftAndRsvpSection({ data }: { data: WeddingData }) {
  const { guestName, guestId } = useGuestName();
  const [name, setName] = useState(guestName ?? "");
  const [attendCount, setAttendCount] = useState(1);
  const [isAttending, setIsAttending] = useState(true);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [giftModal, setGiftModal] = useState<"groom" | "bride" | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (guestName) setName(guestName);
  }, [guestName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guestId ?? undefined,
          guestName: name || "Quý khách",
          status: isAttending
            ? attendCount > 1
              ? "attending_2"
              : "attending_1"
            : "declined",
          notes,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const groomAccount = data.giftAccounts.find(
    (a) =>
      a.owner?.toLowerCase().includes("chú rể") ||
      a.owner?.toLowerCase().includes("groom"),
  ) ?? data.giftAccounts[0];

  const brideAccount = data.giftAccounts.find(
    (a) =>
      a.owner?.toLowerCase().includes("cô dâu") ||
      a.owner?.toLowerCase().includes("bride"),
  ) ?? data.giftAccounts[1] ?? data.giftAccounts[0];

  const currentAccount = giftModal === "bride" ? brideAccount : groomAccount;
  const qrImage =
    giftModal === "bride"
      ? brideAccount?.qrImage || "/templates/olive/demo/qr-bride.webp"
      : groomAccount?.qrImage || "/templates/olive/demo/qr-groom.webp";
  const bankName =
    giftModal === "bride"
      ? brideAccount?.bankName || "VIETCOMBANK"
      : groomAccount?.bankName || "MB BANK";
  const stk =
    giftModal === "bride"
      ? brideAccount?.accountNumber || "9376 6658 88"
      : groomAccount?.accountNumber || "0332 4071 98";
  const holderName =
    giftModal === "bride"
      ? brideAccount?.accountHolder || data.bride.fullName || "HOANG THI LAM HUYEN"
      : groomAccount?.accountHolder || data.groom.fullName || "NGUYEN HUU THONG";

  const handleCopyStk = () => {
    if (stk) {
      navigator.clipboard.writeText(stk);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative w-full bg-[#f8f8f4] py-14 px-5 text-center text-[#4e6437] border-t border-[#4e6437]/10 overflow-hidden">
      {/* Background floral watermark in corner */}
      <div className="absolute right-0 bottom-0 w-36 h-auto pointer-events-none opacity-60 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/olive/decor-flower3.png"
          alt=""
          className="w-full h-auto object-contain translate-x-4 translate-y-4"
        />
      </div>

      <div className="relative z-10 max-w-[460px] mx-auto">
        {/* The Two Olive Pill Buttons for Gift matching screenshot 1 */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-center gap-3.5 mb-14">
            <button
              type="button"
              onClick={() => {
                setGiftModal("groom");
                setCopied(false);
              }}
              className="flex items-center justify-center gap-3 w-full max-w-[340px] rounded-full bg-[#4e6437] py-3.5 px-6 text-white font-bold text-base sm:text-lg shadow-md hover:bg-[#3f522c] active:scale-[0.98] transition-all"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              <svg
                className="w-5 h-5 text-white shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              <span>Quà mừng cưới chú rể</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setGiftModal("bride");
                setCopied(false);
              }}
              className="flex items-center justify-center gap-3 w-full max-w-[340px] rounded-full bg-[#4e6437] py-3.5 px-6 text-white font-bold text-base sm:text-lg shadow-md hover:bg-[#3f522c] active:scale-[0.98] transition-all"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              <svg
                className="w-5 h-5 text-white shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              <span>Quà mừng cưới cô dâu</span>
            </button>
          </div>
        </RevealOnScroll>

        {/* Title: Xác Nhận Tham Dự matching screenshot 1 */}
        <RevealOnScroll variant="fade-up" delay={80}>
          <h2
            className="text-[clamp(44px,9vw,60px)] leading-none text-[#4e6437]"
            style={{ fontFamily: "var(--font-high-spirited), cursive" }}
          >
            Xác Nhận Tham Dự
          </h2>
          <p
            className="mt-2.5 text-sm sm:text-base text-[#4e6437]/90 leading-relaxed font-normal"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Việc xác nhận giúp chúng mình chuẩn bị chu đáo hơn.
            <br />
            Cảm ơn bạn!
          </p>
        </RevealOnScroll>

        {/* RSVP Form Container matching screenshot 1 */}
        <RevealOnScroll variant="fade-up" delay={160}>
          <div className="mt-6 rounded-2xl bg-[#edf1ea] border border-stone-200/80 p-5 shadow-sm text-left">
            {submitted ? (
              <div className="py-6 text-center text-[#4e6437]">
                <p className="text-base font-bold">Cảm ơn bạn đã phản hồi!</p>
                <p className="mt-1 text-sm text-[#4e6437]/80">
                  Rất vui và mong sớm gặp lại bạn trong ngày vui của chúng mình.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Họ và tên * */}
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và tên *"
                    className="w-full rounded-xl bg-white border border-stone-200 px-4 py-3 text-sm text-[#333] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4e6437] shadow-sm"
                  />
                </div>

                {/* Số người tham dự */}
                <div>
                  <label
                    className="block text-sm font-semibold text-[#333] mb-1.5"
                    style={{ fontFamily: "var(--font-lora), serif" }}
                  >
                    Số người tham dự
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={attendCount}
                    onChange={(e) =>
                      setAttendCount(Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                    className="w-full rounded-xl bg-white border border-stone-200 px-4 py-3 text-sm text-[#333] focus:outline-none focus:ring-2 focus:ring-[#4e6437] shadow-sm"
                  />
                </div>

                {/* Radio choices */}
                <div className="space-y-2.5 pt-1 text-sm text-[#333]">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="attending"
                      checked={isAttending === true}
                      onChange={() => setIsAttending(true)}
                      className="w-4 h-4 accent-[#4e6437] cursor-pointer"
                    />
                    <span className="font-normal">Có, tôi sẽ tham dự</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="attending"
                      checked={isAttending === false}
                      onChange={() => setIsAttending(false)}
                      className="w-4 h-4 accent-[#4e6437] cursor-pointer"
                    />
                    <span className="font-normal">Xin lỗi, tôi bận mất rồi!</span>
                  </label>
                </div>

                {/* Lời nhắn cho Cô Dâu & Chú Rể */}
                <div className="pt-1">
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Lời nhắn cho Cô Dâu & Chú Rể"
                    className="w-full rounded-xl bg-white border border-stone-200 px-4 py-3 text-sm text-[#333] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4e6437] shadow-sm resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mx-auto block rounded-full bg-[#4e6437] px-10 py-2.5 text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#3d502a] active:scale-95 transition-all"
                    style={{ fontFamily: "var(--font-lora), serif" }}
                  >
                    {submitting ? "Đang gửi..." : "Xác nhận"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </RevealOnScroll>
      </div>

      {/* Modal Quà mừng cưới (mounted directly on document.body via Portal) */}
      {mounted &&
        giftModal &&
        createPortal(
          <div
            onClick={() => setGiftModal(null)}
            className="fixed inset-0 z-[999999] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 transition-all"
            style={{ margin: 0 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-[22px] px-6 py-6 w-full max-w-[340px] text-center shadow-2xl animate-fade-in"
            >
              {/* Close button with circular border matching reference screenshot */}
              <button
                type="button"
                onClick={() => setGiftModal(null)}
                className="absolute top-4 right-4 w-6 h-6 rounded-full border border-stone-300 text-stone-400 hover:text-stone-700 hover:border-stone-500 flex items-center justify-center text-xs transition-colors"
                aria-label="Đóng"
              >
                ✕
              </button>

              {/* Title: Quà mừng cưới chú rể / cô dâu */}
              <h3
                className="text-[21px] font-normal text-[#4e6437] mb-2"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                Quà mừng cưới {giftModal === "bride" ? "cô dâu" : "chú rể"}
              </h3>

              {/* QR Code */}
              {qrImage && (
                <div className="relative mx-auto my-2 w-56 h-56 flex items-center justify-center">
                  <Image
                    src={qrImage}
                    alt={`Mã QR mừng cưới ${giftModal === "bride" ? "cô dâu" : "chú rể"}`}
                    width={224}
                    height={224}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Account details: 3 centered lines matching MiuWedding */}
              <div
                className="mt-3 text-center space-y-1"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                <p className="text-[17px] font-bold text-[#4e6437] uppercase tracking-wide">
                  {holderName}
                </p>
                <p className="text-[14px] font-normal text-[#4e6437]/80 uppercase">
                  {bankName}
                </p>
                <div
                  onClick={handleCopyStk}
                  className="inline-flex items-center justify-center gap-1.5 cursor-pointer select-all group mt-0.5"
                  title="Nhấn để sao chép số tài khoản"
                >
                  <p className="text-[16px] font-medium text-[#4e6437] tracking-wider">
                    {stk}
                  </p>
                  {copied ? (
                    <span className="text-xs text-emerald-600 font-medium">✓ Đã chép</span>
                  ) : (
                    <span className="text-[11px] text-stone-400 group-hover:text-stone-600">📋</span>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

function ClosingSection({ data }: { data: WeddingData }) {
  const photo =
    data.closingPhoto ||
    (data.gallery?.[4]?.src && !isDefaultStock(data.gallery[4].src)
      ? data.gallery[4].src
      : data.gallery?.[0]?.src && !isDefaultStock(data.gallery[0].src)
        ? data.gallery[0].src
        : "/templates/olive/demo/closing.webp");

  return (
    <section className="relative w-full bg-[#f8f8f4] text-[#4e6437] overflow-hidden pt-8">
      {/* Delicate floral sketch watermark on top right */}
      <div className="absolute right-0 top-0 w-36 sm:w-44 h-auto pointer-events-none opacity-80 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/olive/decor-flower3.png"
          alt=""
          className="w-full h-auto object-contain translate-x-2 -translate-y-2"
        />
      </div>

      {/* Top presence greeting on textured paper background */}
      <div className="relative z-10 max-w-[460px] mx-auto px-6 pb-8 text-center">
        <RevealOnScroll variant="fade-up">
          <p
            className="text-[20px] sm:text-[23px] font-normal leading-[1.4] text-[#4e6437] whitespace-pre-line"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            {data.thankYouText || (
              <>
                Sự hiện diện của bạn là
                <br />
                niềm vinh hạnh của gia đình chúng tôi!
              </>
            )}
          </p>
        </RevealOnScroll>
      </div>

      {/* Framed couple photo card with rounded corners & shadow */}
      <RevealOnScroll variant="fade-up" delay={150}>
        <div className="relative z-10 mx-auto w-[calc(100%-32px)] max-w-[500px] h-[520px] sm:h-[580px] rounded-[20px] overflow-hidden shadow-2xl mb-8">
          <Image
            src={photo}
            alt="Thank You"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 500px"
          />
          {/* Subtle bottom gradient to ensure readability of white cursive text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Overlaid text in bottom-right corner */}
          <div className="absolute right-6 bottom-7 z-10 text-left text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] select-none">
            <p
              className="text-[54px] sm:text-[68px] leading-none mb-2"
              style={{ fontFamily: "var(--font-flavinda), cursive" }}
            >
              In you
            </p>
            <p
              className="text-[17px] sm:text-[21px] leading-[1.3] font-normal"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              I’ve found my home
              <br />
              my heart
              <br />
              and my forever!
            </p>
          </div>
        </div>
      </RevealOnScroll>

      {/* Clean Footer below the photo card */}
      <div className="relative z-10 pb-12 pt-2 text-center text-xs text-stone-500 font-normal">
        Thiệp cưới online &amp; sự kiện -{" "}
        <span className="text-[#d81b60] font-semibold">Miu Wedding</span>
      </div>
    </section>
  );
}

function FloatingControls({ data }: { data: WeddingData }) {
  const music = useMusicOptional();
  const [shareOpen, setShareOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!shareOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".olive-share-container")) {
        setShareOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [shareOpen]);

  const handleShare = (type: "facebook" | "zalo" | "copy") => {
    const url = encodeURIComponent(window.location.href);
    if (type === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    } else if (type === "zalo") {
      window.open(`https://zalo.me/share?url=${url}`, "_blank");
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link thiệp cưới!");
    }
    setShareOpen(false);
  };

  if (!mounted || typeof document === "undefined") return null;

  const content = (
    <div className="olive-floating-controls olive-share-container">
      {/* Share popover */}
      {shareOpen && (
        <div className="flex flex-col gap-2 rounded-2xl bg-stone-900/90 backdrop-blur-md p-3 shadow-2xl text-white text-xs font-semibold min-w-[150px] border border-white/10 animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={() => handleShare("facebook")}
            className="px-3.5 py-2 rounded-xl hover:bg-white/20 text-left transition-colors flex items-center gap-2 cursor-pointer"
          >
            Chia sẻ Facebook
          </button>
          <button
            type="button"
            onClick={() => handleShare("zalo")}
            className="px-3.5 py-2 rounded-xl hover:bg-white/20 text-left transition-colors flex items-center gap-2 cursor-pointer"
          >
            Chia sẻ Zalo
          </button>
          <button
            type="button"
            onClick={() => handleShare("copy")}
            className="px-3.5 py-2 rounded-xl hover:bg-white/20 text-left transition-colors flex items-center gap-2 cursor-pointer"
          >
            Sao chép liên kết
          </button>
        </div>
      )}

      {/* Share Toggle Button */}
      <button
        type="button"
        onClick={() => setShareOpen(!shareOpen)}
        aria-label="Chia sẻ thiệp"
        className="w-12 h-12 rounded-full bg-stone-900/85 hover:bg-stone-900 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all backdrop-blur-md border border-white/20 cursor-pointer"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
      </button>

      {/* Music Toggle Button (Spinning vinyl record style) */}
      {data.theme.music && (
        <button
          type="button"
          onClick={() => music?.toggle()}
          aria-label={music?.playing ? "Tắt nhạc" : "Bật nhạc"}
          className={cn(
            "relative w-12 h-12 rounded-full bg-stone-900/90 hover:bg-stone-900 text-white flex items-center justify-center shadow-xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md",
            music?.playing && "animate-[spin_4s_linear_infinite]",
          )}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </button>
      )}
    </div>
  );

  return createPortal(content, document.body);
}

export function OliveWaxSealLayout({ data }: { data: WeddingData }) {
  return (
    <div className="miu-canvas w-full mx-auto overflow-hidden">
      <HeroHeader data={data} />
      <QuoteSection />
      <CoupleProfiles data={data} />
      <FamilyInvitation data={data} />
      <EventDetails data={data} />
      <CalendarAndCountdown data={data} />
      <TimelineSection data={data} />
      <MemoriesGallery data={data} />
      <GuestbookSection />
      <GiftAndRsvpSection data={data} />
      <ClosingSection data={data} />
      <FloatingControls data={data} />
    </div>
  );
}
