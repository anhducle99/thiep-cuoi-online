"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionBand } from "@/components/ui/SectionBand";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useGuestName } from "@/components/GuestNameProvider";
import type { SectionProps, Wish } from "@/types/wedding";
import { getCurrentSlug } from "@/lib/currentSlug";

export function Guestbook({ className }: SectionProps) {
  const { guestName } = useGuestName();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (guestName) setName(guestName);
  }, [guestName]);

  useEffect(() => {
    setLoading(true);
    const slug = getCurrentSlug();
    const query = slug ? `?slug=${encodeURIComponent(slug)}` : "";
    fetch(`/api/wishes${query}`)
      .then((r) => r.json())
      .then((d) => setWishes(d.wishes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) {
      setError("Vui lòng nhập tên và lời chúc.");
      return;
    }
    setSubmitting(true);
    try {
      const slug = getCurrentSlug();
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          invitedAs: guestName ?? undefined,
          slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWishes((prev) => [data.wish, ...prev]);
      setMessage("");
      if (!guestName) setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={`section-cream py-0 ${className ?? ""}`}>
      <SectionBand title="Sổ lưu bút" />
      <Container className="py-10 sm:py-14">
        {guestName && (
          <p className="mb-4 text-center font-serif text-sm text-crimson">
            Gửi lời chúc với tư cách{" "}
            <span className="font-semibold">{guestName}</span>
          </p>
        )}
        <RevealOnScroll>
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-lg space-y-4 rounded-2xl bg-cream-light p-4 shadow-md sm:p-6"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn*"
              className="w-full rounded-md border border-gold/40 bg-transparent px-4 py-3 font-sans text-sm outline-none transition focus:border-wine"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập lời chúc của bạn*"
              rows={4}
              className="w-full resize-none rounded-md border border-gold/40 bg-transparent px-4 py-3 font-sans text-sm outline-none transition focus:border-wine"
            />
            {error && (
              <p className="text-sm text-red-700">{error}</p>
            )}
            <div className="text-right">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Đang gửi…" : "Gửi lời chúc"}
              </Button>
            </div>
          </form>
        </RevealOnScroll>

        <div className="mt-8">
          {loading ? (
            <p className="text-center text-sm text-ink/40">Đang tải…</p>
          ) : wishes.length === 0 ? (
            <p className="text-center text-sm text-ink/50">
              Chưa có lời chúc nào. Hãy là người đầu tiên!
            </p>
          ) : (
            <ul className="mx-auto max-w-lg space-y-3">
              {wishes.map((w) => (
                <RevealOnScroll key={w.id}>
                  <li className="rounded-xl bg-cream-light px-5 py-4 shadow-sm">
                    <p className="font-serif font-semibold text-crimson">
                      {w.name}
                    </p>
                    {w.invitedAs && (
                      <p className="mt-0.5 text-xs text-ink/50">
                        Khách mời: {w.invitedAs}
                      </p>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">
                      {w.message}
                    </p>
                  </li>
                </RevealOnScroll>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
