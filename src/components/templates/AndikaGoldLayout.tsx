"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import type { WeddingData } from "@/types/wedding";
import { useGuestName } from "@/components/GuestNameProvider";
import { useMusicOptional } from "@/components/MusicProvider";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function FloatingGoldParticles({ count = 20 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3.5 + 1.5,
      duration: Math.random() * 4 + 5,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.45 + 0.2,
    }));
    setParticles(generated);
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [-16, 16, -16],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

interface OpeningScreenProps {
  data: WeddingData;
  guestName: string | null;
  onOpen: () => void;
}

function OpeningScreen({ data, guestName, onOpen }: OpeningScreenProps) {
  const [closing, setClosing] = useState(false);

  function handleOpen() {
    setClosing(true);
    setTimeout(onOpen, 850);
  }

  return (
    <AnimatePresence>
      {!closing ? (
        <motion.div
          key="opening"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(8px)",
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden text-center px-6"
          style={{
            background: "linear-gradient(to bottom, var(--andika-bg, #0B0A08) 0%, var(--andika-secondary, #15130F) 50%, var(--andika-card, #1A1712) 100%)",
          }}
        >
          {/* Ambient Gold Glows */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#B8860B]/10 blur-[120px]" />
          </div>

          <FloatingGoldParticles count={24} />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg mx-auto">
            {/* Top Subtitle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">
                Thư Mời Cưới Trân Trọng
              </span>
              <div className="my-3 h-px w-20 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
            </motion.div>

            {/* Couple Names with Shimmer Effect */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <h1 className="gold-shimmer-text font-serif text-3xl sm:text-5xl font-bold tracking-wide">
                {data.groom.fullName}
              </h1>
              <span className="font-serif text-2xl italic text-[#D4AF37]/70">&</span>
              <h1 className="gold-shimmer-text font-serif text-3xl sm:text-5xl font-bold tracking-wide">
                {data.bride.fullName}
              </h1>
            </motion.div>

            {/* Date & Location */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-col items-center gap-1 text-sm text-[#F7E7CE]/70"
            >
              <p className="font-medium">
                {data.ceremony.date.weekday}, Ngày {data.ceremony.date.day}/{data.ceremony.date.month}/{data.ceremony.date.year}
              </p>
              <p className="text-xs text-[#D4AF37]/80">{data.ceremony.venueName}</p>
            </motion.div>

            {/* Personalized Guest Tag */}
            {guestName && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-6 py-3 backdrop-blur-sm shadow-[0_4px_20px_rgba(212,175,55,0.1)]"
              >
                <p className="font-sans text-xs uppercase tracking-wider text-[#F7E7CE]/70">
                  Kính gửi:
                </p>
                <p className="font-serif text-base font-semibold text-[#D4AF37] mt-0.5">
                  {guestName}
                </p>
              </motion.div>
            )}

            {/* Open Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="pt-2"
            >
              <motion.button
                onClick={handleOpen}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8860B] px-9 py-4 font-sans text-sm font-bold text-[#2A1E12] shadow-[0_8px_32px_rgba(212,175,55,0.4)] cursor-pointer tracking-wider uppercase"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 40px rgba(212,175,55,0.6)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>✉️</span>
                  <span>Mở Thiệp Cưới</span>
                </span>
                <span className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 flex flex-col items-center gap-1.5 opacity-60">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
              Trân trọng kính mời
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function HeroSection({ data }: { data: WeddingData }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-24 px-4 text-center"
      style={{
        background: "linear-gradient(to bottom, var(--andika-bg, #0B0A08) 0%, var(--andika-secondary, #15130F) 50%, var(--andika-bg, #0B0A08) 100%)",
      }}
    >
      <FloatingGoldParticles count={18} />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-sans text-xs uppercase tracking-[0.45em] text-[#D4AF37]/80">
            {data.welcomeText || "The Wedding Of"}
          </span>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent my-2" />
        </motion.div>

        {/* Big Shimmering Typography */}
        <div className="flex flex-col items-center gap-3">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="gold-shimmer-text font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide leading-tight"
          >
            {data.groom.fullName}
          </motion.h1>

          <div className="flex items-center gap-4 w-48 my-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="font-serif text-2xl sm:text-3xl italic text-[#D4AF37]">&</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="gold-shimmer-text font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide leading-tight"
          >
            {data.bride.fullName}
          </motion.h1>
        </div>

        {/* Date & Venue Tag */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <div className="h-px w-28 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          <p className="font-sans text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-[#D4AF37] mt-2">
            {data.ceremony.date.weekday}, {data.ceremony.date.day} THÁNG {data.ceremony.date.month} NĂM {data.ceremony.date.year}
          </p>
          <p className="text-xs sm:text-sm text-[#F7E7CE]/70">
            {data.ceremony.venueName} — {data.ceremony.address}
          </p>
        </div>

        {/* Romantic Love Quote */}
        <div className="mt-4 max-w-md rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6 backdrop-blur-sm">
          <p className="font-serif text-sm sm:text-base italic text-[#F7E7CE]/90 leading-relaxed">
            &ldquo;Hạnh phúc lớn nhất của đời người là tìm được một người để cùng sẻ chia mọi bình minh và hoàng hôn trong cuộc đời.&rdquo;
          </p>
          <p className="text-xs text-[#D4AF37] mt-2">— Forever In Love —</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="h-9 w-5 rounded-full border border-[#D4AF37]/40 flex items-start justify-center pt-1.5">
          <motion.div
            className="h-2 w-0.5 rounded-full bg-[#D4AF37]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}

function CountdownSection({ data }: { data: WeddingData }) {
  const isoDate = data.ceremony.date.iso || "2026-12-20T08:00:00";
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(isoDate).getTime();
    const tick = () => {
      const distance = target - Date.now();
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
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isoDate]);

  const units = [
    { label: "Ngày", val: timeLeft.days },
    { label: "Giờ", val: timeLeft.hours },
    { label: "Phút", val: timeLeft.minutes },
    { label: "Giây", val: timeLeft.seconds },
  ];

  return (
    <section
      id="countdown"
      className="relative py-20 px-4 bg-gradient-to-b from-[#12100C] via-[#15130F] to-[#12100C] text-center"
    >
      <div className="max-w-4xl mx-auto">
        <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#D4AF37]/80">
          Save The Date
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold gold-shimmer-text mt-2 mb-3">
          Đếm Ngược Tới Giờ G
        </h2>
        <div className="mx-auto h-px w-20 bg-[#D4AF37]/40 mb-10" />

        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          {units.map((u, i) => (
            <div
              key={u.label}
              className="rounded-2xl border border-[#D4AF37]/20 bg-[#1A1712]/80 backdrop-blur-md p-5 sm:p-7 min-w-[76px] sm:min-w-[100px] shadow-[0_4px_24px_rgba(212,175,55,0.08)]"
            >
              <div className="font-serif text-3xl sm:text-5xl font-bold text-[#D4AF37]">
                {String(u.val).padStart(2, "0")}
              </div>
              <div className="font-sans text-xs uppercase tracking-widest text-[#F7E7CE]/60 mt-1.5">
                {u.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs sm:text-sm text-[#D4AF37]/80 italic">
          {timeLeft.days > 0
            ? `Còn ${timeLeft.days} ngày nữa đến thời khắc trọng đại! ✨`
            : "Thời khắc hạnh phúc đã bắt đầu! 🎉"}
        </p>
      </div>
    </section>
  );
}

function EventDetailsSection({ data }: { data: WeddingData }) {
  const events = [
    {
      title: data.ceremony.label || "Lễ Thành Hôn",
      venue: data.ceremony.venueName,
      address: data.ceremony.address,
      time: data.ceremony.date.time,
      dateText: `${data.ceremony.date.weekday}, ${data.ceremony.date.day}/${data.ceremony.date.month}/${data.ceremony.date.year}`,
      mapUrl: data.ceremony.mapUrl,
      icon: "⛪",
    },
    {
      title: data.reception.label || "Tiệc Cưới",
      venue: data.reception.venueName,
      address: data.reception.address,
      time: data.reception.date.time,
      dateText: `${data.reception.date.weekday}, ${data.reception.date.day}/${data.reception.date.month}/${data.reception.date.year}`,
      mapUrl: data.reception.mapUrl,
      icon: "🥂",
    },
  ];

  return (
    <section
      id="event"
      className="py-24 px-4 bg-gradient-to-b from-[#12100C] via-[#16140F] to-[#12100C]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#D4AF37]/80">
            Wedding Events
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold gold-shimmer-text mt-2 mb-3">
            Thông Tin Hôn Lễ
          </h2>
          <div className="mx-auto h-px w-20 bg-[#D4AF37]/40 mb-4" />
          <p className="text-xs sm:text-sm text-[#F7E7CE]/70 max-w-md mx-auto">
            Hân hạnh được đón tiếp quý khách đến chung vui cùng gia đình chúng mình.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#D4AF37]/20 bg-[#1A1712]/90 backdrop-blur-md p-7 sm:p-9 shadow-[0_6px_32px_rgba(212,175,55,0.08)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{ev.icon}</span>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                      {ev.title}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FFF8E7]">
                      {ev.venue}
                    </h3>
                  </div>
                </div>

                <div className="h-px w-full bg-[#D4AF37]/20 my-4" />

                <div className="space-y-3 text-xs sm:text-sm text-[#F7E7CE]/80">
                  <p className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">🗓️</span>
                    <span>{ev.dateText}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">⏰</span>
                    <span>Thời gian: {ev.time}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-0.5">📍</span>
                    <span>{ev.address}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#D4AF37]/15">
                <a
                  href={ev.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(ev.venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 py-3 text-xs sm:text-sm font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all cursor-pointer"
                >
                  <span>📍</span>
                  <span>Chỉ Đường Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StorySection({ data }: { data: WeddingData }) {
  const defaultMilestones = [
    {
      year: "2019",
      title: "Gặp Gỡ Định Mệnh",
      desc: "Lần đầu tiên chạm ánh mắt nhau giữa mùa thu Hà Nội, một cảm giác thân thuộc đến kỳ lạ.",
    },
    {
      year: "2021",
      title: "Lời Hẹn Ước Đầu Tiên",
      desc: "Những buổi chiều cùng nhau dạo phố và nhận ra người đối diện chính là một nửa hoàn hảo.",
    },
    {
      year: "2024",
      title: "Lời Cầu Hôn Ngọt Ngào",
      desc: "Dưới ánh hoàng hôn, câu nói 'Em đồng ý' đánh dấu một khởi đầu mới đầy thiêng liêng.",
    },
    {
      year: "2026",
      title: "Chung Đôi Trọn Vẹn",
      desc: "Cùng nắm tay nhau bước vào lễ đường, trước sự chứng kiến và chúc phúc của những người thân yêu.",
    },
  ];

  return (
    <section
      id="story"
      className="py-24 px-4 bg-gradient-to-b from-[#12100C] via-[#171410] to-[#12100C]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#D4AF37]/80">
            Our Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold gold-shimmer-text mt-2 mb-3">
            Hành Trình Yêu Thương
          </h2>
          <div className="mx-auto h-px w-20 bg-[#D4AF37]/40 mb-4" />
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D4AF37]/30 space-y-10 ml-4 sm:ml-12">
          {defaultMilestones.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Golden Badge */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] text-[#2A1E12] font-bold text-xs">
                {idx + 1}
              </div>

              <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#1A1712]/80 backdrop-blur-md p-6 shadow-md hover:border-[#D4AF37]/50 transition-all">
                <span className="font-sans text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                  {item.year}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FFF8E7] mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F7E7CE]/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ gallery }: { gallery: WeddingData["gallery"] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section
      id="gallery"
      className="py-24 px-4 bg-gradient-to-b from-[#12100C] via-[#15130F] to-[#12100C]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#D4AF37]/80">
            Our Memories
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold gold-shimmer-text mt-2 mb-3">
            Khoảnh Khắc Hạnh Phúc
          </h2>
          <div className="mx-auto h-px w-20 bg-[#D4AF37]/40 mb-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {gallery.map((photo, i) => (
            <div
              key={i}
              onClick={() => setSelectedPhoto(photo.src)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-lg cursor-pointer bg-[#1A1712]"
            >
              <Image
                src={photo.src}
                alt={photo.alt || `Kỷ niệm cưới ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-[#D4AF37] text-xs font-semibold">
                  🔍 Xem ảnh lớn
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && typeof document !== "undefined" && (
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] text-2xl flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div
              className="relative max-w-4xl max-h-[85vh] w-full h-[70vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto}
                alt="Ảnh phóng to"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>,
          document.body
        )
      )}
    </section>
  );
}

function RsvpAndGiftSection({ data }: { data: WeddingData }) {
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
    <section
      id="rsvp"
      className="py-24 px-4 bg-gradient-to-b from-[#12100C] via-[#16140F] to-[#0B0A08]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#D4AF37]/80">
            RSVP & Wedding Gift
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold gold-shimmer-text mt-2 mb-3">
            Xác Nhận Tham Dự & Mừng Cưới
          </h2>
          <div className="mx-auto h-px w-20 bg-[#D4AF37]/40 mb-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* RSVP Card */}
          <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#1A1712]/90 backdrop-blur-md p-7 sm:p-9 shadow-xl flex flex-col justify-between h-full">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#FFF8E7] mb-6 text-center">
                Gửi Lời Chúc & Xác Nhận
              </h3>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-3xl flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/40">
                    ✓
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#FFF8E7] mb-2">
                    Cảm Ơn Quý Khách!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#F7E7CE]/70">
                    Lời chúc và phản hồi đã được chuyển thành công đến cô dâu & chú rể.
                  </p>
                  <div className="mt-4 text-2xl">✨🥂⚜️</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập họ và tên của bạn"
                        className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#12100C] px-4 py-3 text-sm text-[#FFF8E7] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                        Số Điện Thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Số điện thoại liên lạc"
                        className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#12100C] px-4 py-3 text-sm text-[#FFF8E7] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                          Khách mời của
                        </label>
                        <select
                          value={formData.side}
                          onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                          className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#12100C] px-4 py-3 text-sm text-[#FFF8E7] focus:border-[#D4AF37] outline-none"
                        >
                          <option value="Nhà trai">Nhà trai (Chú rể)</option>
                          <option value="Nhà gái">Nhà gái (Cô dâu)</option>
                          <option value="Cả hai">Cả hai</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                          Số lượng người
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#12100C] px-4 py-3 text-sm text-[#FFF8E7] focus:border-[#D4AF37] outline-none"
                        >
                          <option value="1">1 người</option>
                          <option value="2">2 người</option>
                          <option value="3">3 người</option>
                          <option value="4">4 người</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1.5">
                        Lời Chúc Phúc
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Gửi lời chúc phúc ngọt ngào..."
                        className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#12100C] px-4 py-3 text-sm text-[#FFF8E7] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8860B] py-3.5 text-sm sm:text-base font-bold text-[#2A1E12] shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.5)] transition-all cursor-pointer uppercase tracking-wider"
                    >
                      {submitting ? "Đang gửi..." : "Gửi Lời Chúc Phúc ⚜️"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Gift Card */}
          <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#1A1712]/90 backdrop-blur-md p-7 sm:p-9 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] text-2xl flex items-center justify-center border border-[#D4AF37]/30">
                  🎁
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FFF8E7]">
                    Hộp Mừng Cưới
                  </h3>
                  <p className="text-xs text-[#D4AF37]">Mừng cưới online tiện lợi & bảo mật</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#F7E7CE]/70 leading-relaxed mb-6">
                Sự hiện diện của quý khách là niềm hạnh phúc lớn nhất. Nếu quý khách muốn gửi món quà mừng, có thể chuyển khoản trực tiếp qua tài khoản dưới đây:
              </p>

              <div className="space-y-4">
                {data.giftAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#D4AF37]/25 bg-[#12100C]/80 p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block rounded-full bg-[#D4AF37]/20 px-2.5 py-0.5 text-xs font-semibold text-[#D4AF37] mb-1">
                          {acc.owner}
                        </span>
                        <p className="font-bold text-[#FFF8E7] text-sm sm:text-base">
                          {acc.bankName}
                        </p>
                        <p className="font-mono text-base sm:text-lg font-bold text-[#D4AF37] tracking-wider my-0.5">
                          {acc.accountNumber}
                        </p>
                        <p className="text-xs uppercase text-[#F7E7CE]/70 font-medium">
                          {acc.accountHolder}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        {acc.accountNumber && (
                          <button
                            onClick={() => copyAccount(acc.accountNumber || "")}
                            className="rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-all cursor-pointer whitespace-nowrap"
                          >
                            {copiedText === acc.accountNumber ? "✓ Đã chép!" : "📋 Sao chép"}
                          </button>
                        )}
                        {acc.qrImage && (
                          <button
                            onClick={() => setQrModalAccount(acc)}
                            className="rounded-lg bg-[#D4AF37] px-3 py-1.5 text-xs font-bold text-[#2A1E12] shadow-sm hover:bg-[#F5D76E] transition-all cursor-pointer whitespace-nowrap"
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

            {/* Bottom Balance Box */}
            <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 text-center">
              <p className="text-xs text-[#D4AF37] leading-relaxed font-medium">
                ✨ Quý khách có thể nhấn <strong>&quot;Sao chép&quot;</strong> hoặc quét <strong>&quot;Mã QR&quot;</strong> để chuyển khoản nhanh chóng qua ứng dụng ngân hàng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalAccount && typeof document !== "undefined" && (
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setQrModalAccount(null)}
          >
            <div
              className="relative w-full max-w-sm rounded-3xl bg-[#1A1712] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-center text-[#FFF8E7]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setQrModalAccount(null)}
                className="absolute top-4 right-4 text-[#D4AF37] hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
              <span className="inline-block rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#D4AF37] mb-2">
                Mừng Cưới {qrModalAccount.owner}
              </span>
              <h4 className="font-serif text-xl font-bold text-[#FFF8E7]">
                {qrModalAccount.bankName}
              </h4>
              <p className="text-sm font-mono font-bold text-[#D4AF37] my-1">
                {qrModalAccount.accountNumber}
              </p>
              <p className="text-xs uppercase text-[#F7E7CE]/70 mb-4">
                {qrModalAccount.accountHolder}
              </p>

              {qrModalAccount.qrImage && (
                <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-inner bg-white">
                  <Image
                    src={qrModalAccount.qrImage}
                    alt={`Mã QR ${qrModalAccount.owner}`}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              )}

              <p className="text-xs text-[#F7E7CE]/70 mt-4">
                Quét mã QR bằng App ngân hàng để gửi quà mừng tiện lợi.
              </p>
            </div>
          </div>,
          document.body
        )
      )}
    </section>
  );
}

function FooterSection({ data }: { data: WeddingData }) {
  return (
    <footer className="py-20 px-4 bg-gradient-to-b from-[#0B0A08] to-[#050504] text-center border-t border-[#D4AF37]/20">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <span className="text-3xl text-[#D4AF37]">⚜️</span>

        <h2 className="font-serif text-2xl sm:text-4xl font-bold gold-shimmer-text">
          Chân Thành Cảm Ơn
        </h2>
        <div className="h-px w-20 bg-[#D4AF37]/40 my-1" />

        <p className="font-serif text-sm sm:text-lg italic text-[#F7E7CE]/80 max-w-xl leading-relaxed">
          &ldquo;{data.thankYouText || "Sự hiện diện và lời chúc phúc của quý khách là niềm vinh hạnh to lớn cho gia đình chúng mình!"}&rdquo;
        </p>

        <p className="font-serif text-2xl sm:text-3xl text-[#D4AF37] font-bold mt-2">
          Xuân Phú
        </p>

        <p className="text-xs uppercase tracking-widest text-[#F7E7CE]/50">
          #XUANPHU2026 #FOREVERSTARTSNOW
        </p>

        <div className="mt-6 text-center text-xs text-[#F7E7CE]/60 font-normal">
          Thiệp cưới online &amp; sự kiện -{" "}
          <span className="text-[#D4AF37] font-semibold">Xuân Phú</span>
        </div>
      </div>
    </footer>
  );
}

const NAV_SECTIONS = [
  { id: "hero", label: "Trang chủ" },
  { id: "countdown", label: "Đếm ngược" },
  { id: "event", label: "Hôn lễ" },
  { id: "story", label: "Hành trình" },
  { id: "gallery", label: "Kỷ niệm" },
  { id: "rsvp", label: "Tham dự" },
];

function FloatingRightNav({
  activeSection,
  onScrollTo,
}: {
  activeSection: string;
  onScrollTo: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="rounded-2xl border border-[#D4AF37]/30 bg-[#15130F]/95 p-2 shadow-2xl backdrop-blur-md flex flex-col gap-1"
          >
            {NAV_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  onScrollTo(sec.id);
                  setExpanded(false);
                }}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-left text-xs transition-all cursor-pointer ${
                  activeSection === sec.id
                    ? "bg-[#D4AF37] text-[#2A1E12] font-bold"
                    : "text-[#F7E7CE]/70 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeSection === sec.id ? "bg-[#2A1E12]" : "bg-[#D4AF37]"
                  }`}
                />
                {sec.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-[#15130F]/90 text-[#D4AF37] flex items-center justify-center shadow-lg hover:border-[#D4AF37] transition-all cursor-pointer text-sm"
        title="Menu"
      >
        ⚜
      </button>

      {/* Dots Indicator */}
      <div className="flex flex-col gap-1.5 items-end py-1">
        {NAV_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => onScrollTo(sec.id)}
            className="cursor-pointer py-0.5"
            title={sec.label}
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                activeSection === sec.id
                  ? "h-1.5 w-4 bg-[#D4AF37]"
                  : "h-1.5 w-1.5 bg-[#D4AF37]/40 hover:bg-[#D4AF37]"
              }`}
            />
          </button>
        ))}
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
        className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-lg border-2 border-[#D4AF37]/60 transition-all cursor-pointer backdrop-blur-md ${
          music.playing
            ? "bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-[#2A1E12] animate-spin [animation-duration:6s] shadow-[0_0_24px_rgba(212,175,55,0.4)]"
            : "bg-[#15130F]/90 text-[#D4AF37]"
        }`}
        title={music.playing ? "Tắt nhạc" : "Bật nhạc"}
      >
        {music.playing ? "🎵" : "🔇"}
      </button>
    </div>
  );
}

export function AndikaGoldLayout({
  data,
  onStartMusic,
}: {
  data: WeddingData;
  onStartMusic?: () => void;
}) {
  const { guestName } = useGuestName();
  const [showOpening, setShowOpening] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    if (showOpening) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOpening]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpen = () => {
    setShowOpening(false);
    if (onStartMusic) {
      onStartMusic();
    }
  };

  if (showOpening) {
    return (
      <OpeningScreen
        data={data}
        guestName={guestName}
        onOpen={handleOpen}
      />
    );
  }

  return (
    <div
      className="relative min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#FFF8E7]"
      style={{
        backgroundColor: "var(--andika-bg, #0B0A08)",
        color: "var(--andika-text, #FFF8E7)",
      }}
    >
      {/* Floating Right Navigation */}
      <FloatingRightNav
        activeSection={activeSection}
        onScrollTo={scrollTo}
      />

      {/* Hero Section */}
      <HeroSection data={data} />

      {/* Countdown Section */}
      <CountdownSection data={data} />

      {/* Event Details Section */}
      <EventDetailsSection data={data} />

      {/* Story Timeline Section */}
      <StorySection data={data} />

      {/* Gallery Section */}
      <GallerySection gallery={data.gallery} />

      {/* RSVP & Gift Section */}
      <RsvpAndGiftSection data={data} />

      {/* Footer Section */}
      <FooterSection data={data} />

      {/* Floating Music Player */}
      <FloatingMusicPlayer />
    </div>
  );
}
