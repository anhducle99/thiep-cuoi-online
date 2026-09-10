"use client";

import { useEffect, useRef, useState } from "react";
import { useGuestName } from "@/components/GuestNameProvider";
import { Button } from "@/components/ui/Button";
import type { RsvpRecord, RsvpStatus, SectionProps } from "@/types/wedding";
import { cn } from "@/lib/utils";
import { getCurrentSlug } from "@/lib/currentSlug";

const STATUS_LABEL: Record<RsvpStatus, string> = {
  attending_1: "Tham dự (1 người)",
  attending_2: "Tham dự (2 người)",
  declined: "Từ chối",
};

export function RsvpConfirm({ className }: SectionProps) {
  const { guestName, guestId } = useGuestName();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rsvp, setRsvp] = useState<RsvpRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!guestName && !guestId) return;

    const params = new URLSearchParams();
    if (guestId) params.set("guestId", guestId);
    if (guestName) params.set("guestName", guestName);
    const slug = getCurrentSlug();
    if (slug) params.set("slug", slug);

    void fetch(`/api/rsvp?${params}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { rsvp?: RsvpRecord | null }) => {
        if (data.rsvp) setRsvp(data.rsvp);
      })
      .catch(() => {});
  }, [guestName, guestId]);

  const handleSubmit = async (status: RsvpStatus) => {
    if (!guestName) {
      setError("Vui lòng mở thiệp bằng link mời cá nhân để xác nhận.");
      return;
    }
    setSubmitting(true);
    setError("");
    const slug = getCurrentSlug();
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId, guestName, status, slug }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Không gửi được xác nhận.");
      return;
    }
    setRsvp(data.rsvp);
    setExpanded(false);
  };

  return (
    <div
      ref={sectionRef}
      className={cn(
        "rsvp-confirm relative mx-auto mt-8 max-w-sm scroll-mt-24 px-2",
        inView && "rsvp-confirm--spotlight",
        className,
      )}
    >
      <p className="font-serif text-sm text-ink/70">
        {guestName ? (
          <>
            Kính mời <span className="font-semibold text-crimson">{guestName}</span>,
            vui lòng xác nhận tham dự
          </>
        ) : (
          "Vui lòng xác nhận tham dự tiệc cưới"
        )}
      </p>

      {rsvp ? (
        <div className="mt-5 rounded-2xl border border-gold/40 bg-cream px-4 py-5 text-center">
          <p className="font-serif text-base font-semibold text-crimson">
            Đã ghi nhận xác nhận
          </p>
          <p className="mt-2 text-sm text-ink/75">{STATUS_LABEL[rsvp.status]}</p>
          <button
            type="button"
            onClick={() => {
              setRsvp(null);
              setExpanded(true);
            }}
            className="mt-4 text-xs text-ink/50 underline hover:text-crimson"
          >
            Thay đổi lựa chọn
          </button>
        </div>
      ) : expanded ? (
        <div className="mt-5 space-y-3 animate-fade-in">
          <Button
            variant="solid"
            className="w-full"
            disabled={submitting}
            onClick={() => handleSubmit("attending_1")}
          >
            Tham dự (1 người)
          </Button>
          <Button
            variant="solid"
            className="w-full"
            disabled={submitting}
            onClick={() => handleSubmit("attending_2")}
          >
            Tham dự (2 người)
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={submitting}
            onClick={() => handleSubmit("declined")}
          >
            Từ chối
          </Button>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="w-full text-center text-xs text-ink/50 hover:text-crimson"
          >
            Đóng
          </button>
        </div>
      ) : (
        <div className="mt-5 flex justify-center">
          <Button
            className={cn(
              "rsvp-confirm__cta min-w-[220px]",
              inView && "rsvp-confirm__cta--pulse",
            )}
            onClick={() => setExpanded(true)}
          >
            Xác nhận tham dự
          </Button>
        </div>
      )}

      {error && <p className="mt-3 text-center text-sm text-red-700">{error}</p>}
    </div>
  );
}
