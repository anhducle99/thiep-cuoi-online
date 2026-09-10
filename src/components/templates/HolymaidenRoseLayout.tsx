"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import type { WeddingData } from "@/types/wedding";
import { useGuestName } from "@/components/GuestNameProvider";
import { useMusicOptional } from "@/components/MusicProvider";

function generateGoogleCalendarLink(event: {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}): string {
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    text: event.title,
    dates: `${formatDate(event.start)}/${formatDate(event.end)}`,
    details: event.description || "",
    location: event.location || "",
  });

  return `${baseUrl}&${params.toString()}`;
}

function generateMapLink(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

const SECTIONS = [
  { id: "hero", label: "Trang chủ", icon: "🏠", gradient: "from-rose-500 to-pink-500" },
  { id: "couple", label: "Cặp đôi", icon: "💕", gradient: "from-pink-500 to-rose-500" },
  { id: "details", label: "Ngày cưới", icon: "📅", gradient: "from-purple-500 to-indigo-500" },
  { id: "venue", label: "Địa điểm", icon: "📍", gradient: "from-indigo-500 to-blue-500" },
  { id: "gallery", label: "Kỷ niệm", icon: "📸", gradient: "from-blue-500 to-cyan-500" },
  { id: "rsvp", label: "Tham dự", icon: "✉️", gradient: "from-cyan-500 to-teal-500" },
];

interface LetterAnimationProps {
  onOpen: () => void;
  coupleName: string;
  guestName?: string | null;
}

function LetterAnimation({ onOpen, coupleName, guestName }: LetterAnimationProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 2400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--rose-bg, #fff0f3) 0%, var(--rose-card, #ffe5ec) 50%, var(--rose-bg, #fff0f3) 100%)",
      }}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />
      </div>

      {/* Floating Hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "105%", opacity: 0.2, rotate: 0 }}
            animate={{
              y: "-105%",
              opacity: [0.2, 0.7, 0.2],
              rotate: [0, 180, 360],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
            }}
            transition={{
              duration: 9 + i * 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.1,
            }}
            className="absolute text-xl sm:text-2xl text-rose-300"
            style={{ left: `${8 + i * 12}%` }}
          >
            {i % 2 === 0 ? "💕" : "💖"}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 text-center">
        {/* Greeting Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-rose-600 font-semibold mb-2">
            Thư Mời Cưới Trân Trọng
          </p>
          <h1 className="font-serif text-2xl sm:text-4xl text-gray-800 font-medium">
            {coupleName}
          </h1>
          <div className="mt-3 text-sm sm:text-base text-gray-600">
            {guestName ? (
              <p>
                Kính gửi:{" "}
                <span className="font-semibold text-rose-600 border-b border-rose-300 pb-0.5">
                  {guestName}
                </span>
                <br />
                Trân trọng kính mời bạn đến chung vui cùng chúng mình
              </p>
            ) : (
              <p>Trân trọng kính mời quý khách đến chung vui cùng ngày hạnh phúc</p>
            )}
          </div>
        </motion.div>

        {/* 3D Envelope Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            className="relative mx-auto w-72 h-52 sm:w-96 sm:h-64 cursor-pointer select-none"
            onClick={handleClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Envelope Back Body */}
            <motion.div
              className="relative mx-auto h-full w-full rounded-2xl bg-gradient-to-br from-rose-200 via-pink-300 to-rose-300 shadow-2xl overflow-hidden border border-rose-200"
              animate={{
                rotateY: isOpening ? 8 : 0,
                z: isOpening ? -40 : 0,
              }}
              transition={{ duration: 0.8 }}
            >
              {/* Inner stitch border */}
              <div className="absolute inset-3 rounded-xl border-2 border-dashed border-rose-400/40 pointer-events-none" />

              {/* Envelope Flap (top triangle) */}
              <motion.div
                className="absolute top-0 left-0 w-full h-28 sm:h-34 bg-gradient-to-b from-rose-300 to-pink-400 origin-top shadow-md"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
                animate={{
                  rotateX: isOpening ? -180 : 0,
                  z: isOpening ? 50 : 0,
                }}
                transition={{ duration: 0.9, delay: isOpening ? 0.15 : 0 }}
              />

              {/* Wax Seal */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 shadow-xl flex items-center justify-center border-2 border-rose-300/40 z-20"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl sm:text-3xl">💌</span>
              </motion.div>
            </motion.div>

            {/* Letter Inside Sliding Out */}
            <AnimatePresence>
              {isOpening && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.85 }}
                  animate={{ y: -60, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.4 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 w-[85%] sm:w-[88%] h-48 sm:h-56 rounded-xl bg-gradient-to-b from-amber-50/95 via-white to-rose-50/95 p-5 shadow-2xl border border-rose-200/80 z-30 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-2xl sm:text-3xl text-rose-500 mb-1">💖</span>
                  {guestName && (
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">
                      Kính gửi: <span className="font-medium text-rose-600">{guestName}</span>
                    </p>
                  )}
                  <h3 className="font-serif text-lg sm:text-xl text-gray-800 font-semibold mb-1">
                    {coupleName}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-600 italic">
                    &ldquo;Hạnh phúc nhất là khi được bên nhau trọn đời.&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sparkles on hover */}
            <AnimatePresence>
              {isHovered && !isOpening && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                        x: [0, (i % 2 === 0 ? 35 : -35)],
                        y: [0, (i % 3 === 0 ? -40 : 40)],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                      className="pointer-events-none absolute top-1/2 left-1/2 text-yellow-400 text-lg"
                    >
                      ✨
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Action Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpening ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 sm:mt-10"
        >
          <motion.p
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-sm sm:text-base font-medium text-gray-700"
          >
            {isHovered ? "Nhấn vào phong bì để mở thiệp cưới ✨" : "Chạm vào phong bì để mở thiệp 👆"}
          </motion.p>
        </motion.div>
      </div>

      {/* Opening Overlay */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-3 h-12 w-12 rounded-full border-4 border-rose-200 border-t-rose-500"
              />
              <p className="font-serif text-lg text-rose-600 font-medium">
                Đang mở thiệp cưới...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingNavigation({
  activeSection,
  onScrollToSection,
}: {
  activeSection: string;
  onScrollToSection: (id: string) => void;
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/90 px-2 py-1.5 shadow-xl backdrop-blur-md border border-white/60">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onScrollToSection(sec.id)}
              className={`relative flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBg"
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${sec.gradient} -z-10`}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="text-xs sm:text-sm">{sec.icon}</span>
              <span className="hidden md:inline whitespace-nowrap">{sec.label}</span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}

function HeroSection({
  data,
  onScrollToSection,
}: {
  data: WeddingData;
  onScrollToSection: (id: string) => void;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 pt-20 pb-10 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-200/25 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl text-center my-auto">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs sm:text-sm font-medium text-rose-600 shadow-sm backdrop-blur-sm border border-rose-200/50"
        >
          <span>✨</span>
          <span>{data.welcomeText || "Our Wedding Celebration"}</span>
          <span>✨</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-gray-800 tracking-tight"
        >
          Our{" "}
          <span className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Wedding
          </span>
        </motion.h1>

        <div className="mx-auto my-6 h-px w-28 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />

        {/* Couple Avatars with Pulse Heart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="my-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          {/* Bride Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-rose-100 to-pink-200">
              <Image
                src={data.bride.photo || "/templates/holymaiden/images/bride-circle.png"}
                alt={data.bride.fullName}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold">
                Cô Dâu
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-800">
                {data.bride.fullName}
              </h3>
            </div>
          </div>

          {/* Heart Icon */}
          <div className="text-3xl sm:text-4xl text-rose-500 animate-pulse my-1 sm:my-0">
            💕
          </div>

          {/* Groom Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-blue-100 to-indigo-200">
              <Image
                src={data.groom.photo || "/templates/holymaiden/images/groom-circle.png"}
                alt={data.groom.fullName}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs uppercase tracking-widest text-blue-500 font-semibold">
                Chú Rể
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-800">
                {data.groom.fullName}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Date Announcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <p className="font-serif text-lg sm:text-2xl text-gray-700 font-medium">
            {data.ceremony.date.weekday},{" "}
            {data.ceremony.date.day}/{data.ceremony.date.month}/{data.ceremony.date.year}
          </p>
          <p className="text-sm text-gray-500 mt-1">{data.ceremony.date.lunar}</p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => onScrollToSection("rsvp")}
            className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-rose-400/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            ✉️ Xác Nhận Tham Dự
          </button>
          <button
            onClick={() => onScrollToSection("details")}
            className="rounded-full bg-white/90 px-7 py-3.5 text-sm sm:text-base font-semibold text-gray-800 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-gray-200/80 backdrop-blur-sm cursor-pointer"
          >
            📅 Xem Chi Tiết
          </button>
        </motion.div>
      </div>

      {/* Scroll Down CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 cursor-pointer text-center"
        onClick={() => onScrollToSection("couple")}
      >
        <span className="text-xs uppercase tracking-widest text-gray-500 font-medium block mb-1">
          Cuộn để khám phá
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block text-lg"
        >
          ⬇️
        </motion.span>
      </motion.div>
    </div>
  );
}

function CoupleIntroduction({ data }: { data: WeddingData }) {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-white via-rose-50/20 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
            Our Love Story
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-800 mt-2">
            Cô Dâu & Chú Rể
          </h2>
          <div className="mx-auto my-4 h-px w-20 bg-rose-400" />
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Hạnh phúc chẳng phải đích đến mà là một hành trình cùng nhau chia ngọt sẻ bùi.
            Chúng mình rất vui khi được chia sẻ niềm hạnh phúc này cùng bạn.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
          {/* Bride Card */}
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-rose-100 flex flex-col items-center text-center relative hover:shadow-2xl transition-all duration-300">
            <div className="relative mb-6">
              <div className="relative w-44 h-44 rounded-full overflow-hidden shadow-xl border-4 border-rose-100 bg-gradient-to-br from-rose-100 to-pink-200">
                <Image
                  src={data.bride.photo || "/templates/holymaiden/images/bride-circle.png"}
                  alt={data.bride.fullName}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-1 w-10 h-10 rounded-full bg-rose-400 text-white flex items-center justify-center text-lg shadow-md">
                👸
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
              Cô Dâu
            </span>
            <h3 className="font-serif text-2xl font-bold text-gray-800 mt-1">
              {data.bride.fullName}
            </h3>
            <div className="my-3 text-xs sm:text-sm text-gray-500 bg-rose-50/60 rounded-xl px-4 py-2 border border-rose-100">
              <p>Thân phụ: <strong>{data.brideParents?.father || "Akiyama Hiroshi"}</strong></p>
              <p>Thân mẫu: <strong>{data.brideParents?.mother || "Akiyama Keiko"}</strong></p>
              {data.brideParents?.address && (
                <p className="text-xs text-gray-400 mt-0.5">{data.brideParents.address}</p>
              )}
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              &ldquo;Một cô gái dịu dàng, luôn mang nụ cười ấm áp và nguồn năng lượng tích cực đến mọi người xung quanh.&rdquo;
            </p>
          </div>

          {/* Groom Card */}
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-blue-100 flex flex-col items-center text-center relative hover:shadow-2xl transition-all duration-300">
            <div className="relative mb-6">
              <div className="relative w-44 h-44 rounded-full overflow-hidden shadow-xl border-4 border-blue-100 bg-gradient-to-br from-blue-100 to-indigo-200">
                <Image
                  src={data.groom.photo || "/templates/holymaiden/images/groom-circle.png"}
                  alt={data.groom.fullName}
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
              <span className="absolute bottom-0 left-1 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg shadow-md">
                🤴
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest text-blue-600 font-semibold">
              Chú Rể
            </span>
            <h3 className="font-serif text-2xl font-bold text-gray-800 mt-1">
              {data.groom.fullName}
            </h3>
            <div className="my-3 text-xs sm:text-sm text-gray-500 bg-blue-50/60 rounded-xl px-4 py-2 border border-blue-100">
              <p>Thân phụ: <strong>{data.groomParents?.father || "M. Anwar"}</strong></p>
              <p>Thân mẫu: <strong>{data.groomParents?.mother || "Hj. Rosdiana"}</strong></p>
              {data.groomParents?.address && (
                <p className="text-xs text-gray-400 mt-0.5">{data.groomParents.address}</p>
              )}
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              &ldquo;Một chàng trai chân thành, chu đáo và luôn là điểm tựa vững chắc nhất cho tổ ấm tương lai.&rdquo;
            </p>
          </div>
        </div>

        {/* Romantic Quote Card */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 p-6 sm:p-8 text-center border border-rose-100/80 shadow-md">
          <p className="font-serif text-lg sm:text-xl text-gray-700 italic">
            &ldquo;You are the one I want to share every sunrise and sunset with.&rdquo;
          </p>
          <p className="text-xs text-rose-500 font-medium mt-2">— Forever Love —</p>
        </div>
      </div>
    </div>
  );
}

function WeddingDetailsAndCountdown({ data }: { data: WeddingData }) {
  const isoDate = data.ceremony.date.iso || "2026-10-15T16:00:00";
  const ceremonyDate = useMemo(() => new Date(isoDate), [isoDate]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(isoDate).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const distance = target - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [isoDate]);

  const calendarLink = generateGoogleCalendarLink({
    title: `Lễ Thành Hôn & Tiệc Cưới: ${data.groom.shortName} & ${data.bride.shortName}`,
    start: ceremonyDate,
    end: new Date(ceremonyDate.getTime() + 4 * 60 * 60 * 1000),
    description: `Trân trọng kính mời quý khách tham dự lễ cưới của ${data.groom.fullName} & ${data.bride.fullName}`,
    location: `${data.ceremony.venueName}, ${data.ceremony.address}`,
  });

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-white to-rose-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
            Save The Date
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-800 mt-2">
            Thông Tin Ngày Cưới
          </h2>
          <div className="mx-auto my-4 h-px w-20 bg-rose-400" />
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Hãy đánh dấu lịch và cùng chúng mình đếm ngược từng khoảnh khắc ngọt ngào nhất!
          </p>
        </div>

        {/* Date Big Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-2xl border border-rose-100 mb-12">
          {/* Day / Month / Time 3 boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 text-center">
            {/* Day */}
            <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-6 text-white shadow-lg flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-6xl font-bold leading-none">
                {data.ceremony.date.day}
              </span>
              <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold opacity-90 mt-2">
                NGÀY
              </span>
            </div>

            {/* Month & Year */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white shadow-lg flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-4xl font-bold leading-tight">
                THÁNG {data.ceremony.date.month}
              </span>
              <span className="text-lg sm:text-xl font-medium opacity-90">
                {data.ceremony.date.year}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold opacity-90 mt-1">
                NĂM
              </span>
            </div>

            {/* Time */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-5xl font-bold leading-none">
                {data.ceremony.date.time}
              </span>
              <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold opacity-90 mt-2">
                GIỜ LỄ
              </span>
            </div>
          </div>

          {/* Weekday Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 p-5 text-center border border-rose-100 mb-8">
            <p className="font-serif text-xl sm:text-3xl font-bold text-gray-800">
              🗓️ {data.ceremony.date.weekday}, Ngày {data.ceremony.date.day} Tháng{" "}
              {data.ceremony.date.month} Năm {data.ceremony.date.year}
            </p>
            <p className="text-xs sm:text-sm text-rose-600 font-medium mt-1">
              ({data.ceremony.date.lunar})
            </p>
          </div>

          {/* Add to Calendar Button */}
          <div className="text-center">
            <a
              href={calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-8 py-4 text-sm sm:text-base font-semibold text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>📅</span>
              <span>Thêm Vào Lịch Google</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Countdown Grid */}
        <div className="rounded-3xl bg-gradient-to-br from-gray-50 via-rose-50/40 to-pink-50/60 p-6 sm:p-10 shadow-xl border border-rose-100/60 text-center">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Đếm Ngược Tới Giây Phút Trọng Đại
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-8">
            Chỉ còn một chút thời gian nữa thôi là chúng mình chính thức về chung một nhà!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {[
              { label: "NGÀY", val: timeLeft.days, color: "from-rose-500 to-pink-600" },
              { label: "GIỜ", val: timeLeft.hours, color: "from-purple-500 to-indigo-600" },
              { label: "PHÚT", val: timeLeft.minutes, color: "from-blue-500 to-cyan-600" },
              { label: "GIÂY", val: timeLeft.seconds, color: "from-emerald-500 to-teal-600" },
            ].map((unit) => (
              <div
                key={unit.label}
                className="rounded-2xl bg-white p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div
                  className={`text-3xl sm:text-5xl font-bold bg-gradient-to-br ${unit.color} bg-clip-text text-transparent`}
                >
                  {String(unit.val).padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 inline-block rounded-full bg-white/80 px-6 py-2.5 text-xs sm:text-sm font-medium text-rose-600 shadow-sm border border-rose-100">
            {timeLeft.days > 0
              ? `Còn ${timeLeft.days} ngày nữa là tới giờ G! 💕`
              : "Thời khắc hạnh phúc đã điểm! 🎉"}
          </div>
        </div>
      </div>
    </div>
  );
}

function VenueInformation({ data }: { data: WeddingData }) {
  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
            Venue & Location
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-800 mt-2">
            Địa Điểm Tổ Chức
          </h2>
          <div className="mx-auto my-4 h-px w-20 bg-rose-400" />
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Hân hạnh được chào đón gia đình, bạn bè và quý quan khách tại hai buổi lễ thân mật.
          </p>
        </div>

        {/* 2 Venue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Ceremony */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-50/60 to-indigo-50/40 p-8 shadow-xl border border-purple-100 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-3xl mx-auto mb-6 shadow-md">
                ⛪
              </div>
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest text-purple-600 font-semibold">
                  Buổi Lễ
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-800 mt-1 mb-2">
                  {data.ceremony.label || "Lễ Thành Hôn"}
                </h3>
                <p className="font-semibold text-gray-800 text-base mb-1">
                  {data.ceremony.venueName}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                  {data.ceremony.address}
                </p>
                <div className="inline-block rounded-xl bg-white/80 px-4 py-2 shadow-sm border border-purple-100 text-xs sm:text-sm font-medium text-purple-700">
                  ⏰ Thời gian: {data.ceremony.date.time} | {data.ceremony.date.day}/{data.ceremony.date.month}/{data.ceremony.date.year}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={data.ceremony.mapUrl || generateMapLink(data.ceremony.venueName)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
              >
                <span>📍</span>
                <span>Xem Bản Đồ Chỉ Đường</span>
              </a>
            </div>
          </div>

          {/* Reception */}
          <div className="rounded-3xl bg-gradient-to-br from-rose-50/60 to-pink-50/40 p-8 shadow-xl border border-rose-100 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center text-3xl mx-auto mb-6 shadow-md">
                🥂
              </div>
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
                  Tiệc Mừng
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-800 mt-1 mb-2">
                  {data.reception.label || "Tiệc Cưới"}
                </h3>
                <p className="font-semibold text-gray-800 text-base mb-1">
                  {data.reception.venueName}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                  {data.reception.address}
                </p>
                <div className="inline-block rounded-xl bg-white/80 px-4 py-2 shadow-sm border border-rose-100 text-xs sm:text-sm font-medium text-rose-700">
                  ⏰ Khai tiệc: {data.reception.date.time} | {data.reception.date.day}/{data.reception.date.month}/{data.reception.date.year}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={data.reception.mapUrl || generateMapLink(data.reception.venueName)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-rose-600 hover:to-pink-700 transition-all"
              >
                <span>📍</span>
                <span>Xem Bản Đồ Chỉ Đường</span>
              </a>
            </div>
          </div>
        </div>

        {/* Useful Notes */}
        <div className="rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 p-6 sm:p-8 border border-rose-100 shadow-sm">
          <h4 className="text-center font-serif text-lg sm:text-xl font-bold text-gray-800 mb-6">
            Lưu Ý Dành Cho Quý Khách
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs sm:text-sm text-gray-600">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-2">👗</span>
              <p className="font-semibold text-gray-800">Trang Phục Gợi Ý</p>
              <p className="text-gray-500 mt-1">Lịch sự, tươi sáng, gam màu pastel / trang nhã</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-2">🚗</span>
              <p className="font-semibold text-gray-800">Bãi Đỗ Xe</p>
              <p className="text-gray-500 mt-1">Bãi đỗ xe rộng rãi, có nhân viên hướng dẫn chu đáo</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-2">📸</span>
              <p className="font-semibold text-gray-800">Chụp Hình Kỷ Niệm</p>
              <p className="text-gray-500 mt-1">Xin vui lòng đến sớm 15-30 phút để chụp ảnh cùng CD-CR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventSchedule({ schedule }: { schedule: WeddingData["schedule"] }) {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
            Wedding Day
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-800 mt-2">
            Lịch Trình Đám Cưới
          </h2>
          <div className="mx-auto my-4 h-px w-20 bg-rose-400" />
        </div>

        {/* Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-rose-200 space-y-8 ml-4 sm:ml-12">
          {schedule.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-rose-500 border-4 border-white shadow-md group-hover:scale-125 transition-transform" />

              <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all">
                <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 mb-2">
                  ⏰ {item.time}
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-gray-800">
                  {item.activity}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryPreview({ gallery }: { gallery: WeddingData["gallery"] }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-gray-50 via-rose-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
            Our Memories
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-800 mt-2">
            Khoảnh Khắc Hạnh Phúc
          </h2>
          <div className="mx-auto my-4 h-px w-20 bg-rose-400" />
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Từng bức hình là một dấu ấn đáng nhớ trên chặng đường chúng mình đã đi qua.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {gallery.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhotoIndex(idx)}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-rose-100"
            >
              <Image
                src={photo.src}
                alt={photo.alt || `Kỷ niệm cưới ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs sm:text-sm font-medium">
                  🔍 Xem ảnh lớn
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && typeof document !== "undefined" && (
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActivePhotoIndex(null)}
          >
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>
            <div
              className="relative max-w-4xl max-h-[85vh] w-full h-[70vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[activePhotoIndex].src}
                alt={gallery[activePhotoIndex].alt || "Ảnh cưới"}
                fill
                className="object-contain"
              />
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
}

function RSVPAndGiftRegistry({ data }: { data: WeddingData }) {
  const { guestName } = useGuestName();
  const [formData, setFormData] = useState({
    name: guestName || "",
    phone: "",
    side: "Chú rể",
    attendance: "yes",
    guests: "1",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [qrModalAccount, setQrModalAccount] = useState<WeddingData["giftAccounts"][0] | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (guestName && !formData.name) {
      setFormData((prev) => ({ ...prev, name: guestName }));
    }
  }, [guestName, formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          message: formData.message.trim() || `Xác nhận tham dự: ${formData.attendance === "yes" ? "Sẽ đến" : "Không thể đến"} (${formData.guests} người)`,
          invitedAs: guestName ?? undefined,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const copyAccount = (accountNum: string) => {
    navigator.clipboard.writeText(accountNum);
    setCopiedText(accountNum);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-rose-50/50 to-pink-100/60">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rose-500 font-semibold">
            RSVP & Wishes
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-800 mt-2">
            Xác Nhận Tham Dự & Mừng Cưới
          </h2>
          <div className="mx-auto my-4 h-px w-20 bg-rose-400" />
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Sự hiện diện và lời chúc phúc của bạn là món quà ý nghĩa nhất đối với chúng mình.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Form Side */}
          <div className="rounded-3xl bg-white p-7 sm:p-9 shadow-xl border border-rose-100 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-gray-800 mb-6 text-center">
                Gửi Lời Chúc & Xác Nhận
              </h3>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto mb-4">
                    ✓
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                    Cảm Ơn Bạn Rất Nhiều!
                  </h4>
                  <p className="text-sm text-gray-600">
                    Lời chúc và phản hồi của bạn đã được gửi thành công đến cô dâu & chú rể.
                  </p>
                  <div className="mt-4 text-2xl">💕🎉✨</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập họ và tên của bạn"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Số Điện Thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Số điện thoại của bạn"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          Bạn là khách của
                        </label>
                        <select
                          value={formData.side}
                          onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white"
                        >
                          <option value="Nhà trai">Nhà trai (Chú rể)</option>
                          <option value="Nhà gái">Nhà gái (Cô dâu)</option>
                          <option value="Cả hai">Cả hai</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          Số người tham dự
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white"
                        >
                          <option value="1">1 người</option>
                          <option value="2">2 người</option>
                          <option value="3">3 người</option>
                          <option value="4">4 người</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Lời Chúc Gửi Đến Cô Dâu & Chú Rể
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Gửi lời chúc phúc ngọt ngào..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-rose-400/40 hover:from-rose-600 hover:to-pink-700 transition-all cursor-pointer disabled:opacity-70"
                    >
                      {submitting ? "Đang gửi..." : "Gửi Xác Nhận & Lời Chúc 💕"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Gift Registry Side */}
          <div className="rounded-3xl bg-white p-7 sm:p-9 shadow-xl border border-amber-100 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 text-2xl flex items-center justify-center">
                  🎁
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-800">
                    Hộp Mừng Cưới
                  </h3>
                  <p className="text-xs text-gray-500">Mừng cưới online tiện lợi & ý nghĩa</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                Nếu không thể chung vui trực tiếp cùng chúng mình, quý khách có thể gửi lời chúc phúc và món quà mừng qua số tài khoản dưới đây:
              </p>

              {/* Bank Accounts */}
              <div className="space-y-4">
                {data.giftAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-gradient-to-r from-rose-50/70 to-pink-50/70 p-4 sm:p-5 border border-rose-100/80 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block rounded-full bg-rose-200/80 px-2.5 py-0.5 text-xs font-semibold text-rose-800 mb-1">
                          {acc.owner}
                        </span>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">
                          {acc.bankName}
                        </p>
                        <p className="font-mono text-base sm:text-lg font-bold text-rose-700 tracking-wider my-0.5">
                          {acc.accountNumber}
                        </p>
                        <p className="text-xs uppercase text-gray-600 font-medium">
                          {acc.accountHolder}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        {acc.accountNumber && (
                          <button
                            onClick={() => copyAccount(acc.accountNumber || "")}
                            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm border border-gray-200 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer whitespace-nowrap"
                          >
                            {copiedText === acc.accountNumber ? "✓ Đã chép!" : "📋 Sao chép"}
                          </button>
                        )}
                        {acc.qrImage && (
                          <button
                            onClick={() => setQrModalAccount(acc)}
                            className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 transition-all cursor-pointer whitespace-nowrap"
                          >
                            📷 Mã QR
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Tip to Balance Height */}
            <div className="mt-6 rounded-2xl bg-amber-50/70 p-4 border border-amber-200/50 text-center">
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                ✨ Quý khách có thể nhấn <strong>&quot;Sao chép&quot;</strong> số tài khoản hoặc <strong>&quot;Mã QR&quot;</strong> để quét mã chuyển khoản nhanh qua ứng dụng ngân hàng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Popup Modal */}
      {qrModalAccount && typeof document !== "undefined" && (
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setQrModalAccount(null)}
          >
            <div
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setQrModalAccount(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
              <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 mb-2">
                Mừng cưới {qrModalAccount.owner}
              </span>
              <h4 className="font-serif text-xl font-bold text-gray-800">
                {qrModalAccount.bankName}
              </h4>
              <p className="text-sm font-mono font-bold text-rose-600 my-1">
                {qrModalAccount.accountNumber}
              </p>
              <p className="text-xs uppercase text-gray-500 mb-4">
                {qrModalAccount.accountHolder}
              </p>

              {qrModalAccount.qrImage && (
                <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
                  <Image
                    src={qrModalAccount.qrImage}
                    alt={`Mã QR ${qrModalAccount.owner}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4">
                Mở ứng dụng ngân hàng và quét mã QR để chuyển khoản nhanh chóng.
              </p>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
}

function ClosingMessage({ data }: { data: WeddingData }) {
  return (
    <div className="py-20 px-4 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-800 mb-4">
          Lời Cảm Ơn
        </h2>
        <div className="mx-auto my-4 h-px w-20 bg-rose-400" />

        <div className="rounded-3xl bg-white/70 backdrop-blur-md p-8 sm:p-12 shadow-xl border border-white/60 my-8">
          <p className="font-serif text-lg sm:text-2xl text-gray-700 italic leading-relaxed mb-6 font-light">
            &ldquo;{data.thankYouText || "Sự hiện diện của bạn là niềm vinh hạnh to lớn cho gia đình chúng mình!"}&rdquo;
          </p>
          <p className="text-sm sm:text-base text-gray-500">With all our love,</p>
          <p className="font-serif text-2xl sm:text-4xl text-rose-600 font-bold mt-2">
            {data.groom.shortName} & {data.bride.shortName}
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 text-3xl text-rose-500 mb-4 animate-bounce">
          <span>💕</span>
          <span>💖</span>
          <span>💕</span>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          #{data.groom.shortName}And{data.bride.shortName}2026 #ForeverStartsNow #LoveWins
        </p>
      </div>
    </div>
  );
}

function NavigationFAB({
  activeSection,
  onScrollToSection,
}: {
  activeSection: string;
  onScrollToSection: (id: string) => void;
}) {
  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const nextSection = SECTIONS[(currentIndex + 1) % SECTIONS.length];
  const progressRatio = (currentIndex + 1) / SECTIONS.length;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative">
        {/* SVG Progress Circle */}
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="rgba(244, 63, 94, 0.15)"
            strokeWidth="3"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="url(#fabRoseGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="175.9"
            animate={{ strokeDashoffset: 175.9 * (1 - progressRatio) }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="fabRoseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Button */}
        <button
          onClick={() => onScrollToSection(nextSection.id)}
          className="absolute inset-1 rounded-full bg-white/95 shadow-xl backdrop-blur-md flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-rose-100"
          title={`Cuộn đến ${nextSection.label}`}
        >
          💕
        </button>
      </div>
    </div>
  );
}

function FloatingMusicPlayer() {
  const music = useMusicOptional();
  if (!music) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={() => music.toggle()}
        className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-lg border-2 border-white transition-all cursor-pointer backdrop-blur-md ${
          music.playing
            ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white animate-spin [animation-duration:6s]"
            : "bg-white/90 text-gray-700"
        }`}
        title={music.playing ? "Tắt nhạc" : "Bật nhạc"}
      >
        {music.playing ? "🎵" : "🔇"}
      </button>
    </div>
  );
}

export function HolymaidenRoseLayout({
  data,
  onStartMusic,
}: {
  data: WeddingData;
  onStartMusic?: () => void;
}) {
  const { guestName } = useGuestName();
  const [showLetter, setShowLetter] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    if (showLetter) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showLetter]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenLetter = () => {
    setShowLetter(false);
    if (onStartMusic) {
      onStartMusic();
    }
  };

  if (showLetter) {
    return (
      <LetterAnimation
        onOpen={handleOpenLetter}
        coupleName={`${data.bride.shortName} & ${data.groom.shortName}`}
        guestName={guestName}
      />
    );
  }

  return (
    <div
      className="relative min-h-screen text-gray-800 selection:bg-rose-200 selection:text-rose-900"
      style={{
        background: "linear-gradient(135deg, var(--rose-bg, #fff0f3) 0%, var(--rose-card, #ffe5ec) 50%, var(--rose-bg, #fff0f3) 100%)",
      }}
    >
      {/* Floating Top Navigation */}
      <FloatingNavigation
        activeSection={activeSection}
        onScrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section id="hero">
        <HeroSection data={data} onScrollToSection={scrollToSection} />
      </section>

      {/* Couple Introduction */}
      <section id="couple">
        <CoupleIntroduction data={data} />
      </section>

      {/* Wedding Details & Countdown */}
      <section id="details">
        <WeddingDetailsAndCountdown data={data} />
      </section>

      {/* Venue Information */}
      <section id="venue">
        <VenueInformation data={data} />
        <EventSchedule schedule={data.schedule} />
      </section>

      {/* Gallery Preview */}
      <section id="gallery">
        <GalleryPreview gallery={data.gallery} />
      </section>

      {/* RSVP & Gift Registry */}
      <section id="rsvp">
        <RSVPAndGiftRegistry data={data} />
      </section>

      {/* Closing Message */}
      <section id="closing">
        <ClosingMessage data={data} />
      </section>

      {/* Navigation FAB */}
      <NavigationFAB
        activeSection={activeSection}
        onScrollToSection={scrollToSection}
      />

      {/* Music Player */}
      <FloatingMusicPlayer />
    </div>
  );
}
