"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/types/wedding";

interface CreateWeddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newSlug: string) => void;
}

const TEMPLATE_OPTIONS: Array<{
  id: ThemeConfig["template"];
  name: string;
  desc: string;
  badge: string;
}> = [
  { id: "olive-wax-seal", name: "Olive Wax Seal", desc: "Phong thư xanh olive, con dấu sáp cổ điển", badge: "bg-lime-900 text-lime-100" },
  { id: "holymaiden-rose", name: "Hồng Pastel", desc: "Phong thư 3D, hoa hồng pastel, trái tim", badge: "bg-rose-500 text-white" },
  { id: "luxury-gold-black", name: "Hoàng Gia Ánh Kim", desc: "Vàng 24K ánh kim, than chì huyền bí", badge: "bg-amber-700 text-white" },
  { id: "song-hy-do", name: "Song Hỷ Đỏ", desc: "Truyền thống đám cưới Việt rực rỡ", badge: "bg-red-700 text-white" },
];

function generateSlug(groom: string, bride: string): string {
  const g = groom.trim().split(" ").pop() || "";
  const b = bride.trim().split(" ").pop() || "";
  const raw = `${g} ${b}`.toLowerCase();
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CreateWeddingModal({
  isOpen,
  onClose,
  onCreated,
}: CreateWeddingModalProps) {
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEditedManually, setSlugEditedManually] = useState(false);
  const [template, setTemplate] = useState<ThemeConfig["template"]>("olive-wax-seal");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGroomChange = (val: string) => {
    setGroomName(val);
    if (!slugEditedManually) {
      setSlug(generateSlug(val, brideName));
    }
  };

  const handleBrideChange = (val: string) => {
    setBrideName(val);
    if (!slugEditedManually) {
      setSlug(generateSlug(groomName, val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugEditedManually(true);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-"),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomName.trim() || !brideName.trim() || !slug.trim()) {
      setError("Vui lòng điền đầy đủ tên chú rể, tên cô dâu và đường dẫn link.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/admin/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groomName: groomName.trim(),
          brideName: brideName.trim(),
          slug: slug.trim(),
          template,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Không thể tạo đám cưới mới.");
        setBusy(false);
        return;
      }

      setBusy(false);
      onCreated(data.wedding?.slug || slug.trim());
      onClose();
    } catch {
      setError("Lỗi kết nối khi tạo đám cưới.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gold/30 bg-[#fdfbf7] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gold/20 pb-3">
          <h3 className="font-serif text-lg font-bold text-wine">
            Tạo đám cưới mới cho cặp đôi
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-ink/40 hover:bg-gold/15 hover:text-ink"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-ink/80 mb-1">
                Tên chú rể <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => handleGroomChange(e.target.value)}
                placeholder="VD: Nguyễn Văn Tuấn"
                className="w-full rounded-lg border border-gold/40 bg-white px-3 py-2 text-ink outline-none focus:border-wine focus:ring-1 focus:ring-wine"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-ink/80 mb-1">
                Tên cô dâu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => handleBrideChange(e.target.value)}
                placeholder="VD: Trần Thị Lan"
                className="w-full rounded-lg border border-gold/40 bg-white px-3 py-2 text-ink outline-none focus:border-wine focus:ring-1 focus:ring-wine"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-ink/80 mb-1">
              Đường dẫn link thiệp (Slug) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-lg border border-gold/40 bg-white px-3 py-2 focus-within:border-wine focus-within:ring-1 focus-within:ring-wine">
              <span className="text-ink/40 select-none">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="tuan-lan"
                className="ml-1 w-full bg-transparent text-ink font-mono outline-none"
                required
              />
            </div>
            <p className="mt-1 text-[11px] text-ink/50">
              Link xem thiệp sẽ là:{" "}
              <code className="font-semibold text-wine">
                xuanphu.vercel.app/{slug || "ten-duong-dan"}
              </code>
            </p>
          </div>

          <div>
            <label className="block font-medium text-ink/80 mb-2">
              Chọn mẫu thiệp khởi tạo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTemplate(opt.id)}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    template === opt.id
                      ? "border-wine bg-wine/5 ring-1 ring-wine"
                      : "border-gold/30 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{opt.name}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${opt.badge}`}>
                      Mẫu
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-ink/60 line-clamp-2 leading-relaxed">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-gold/20 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-lg border border-ink/20 px-4 py-2 text-ink/70 hover:bg-gold/10"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-wine px-5 py-2 font-medium text-cream-light shadow hover:bg-wine/90 disabled:opacity-50"
            >
              {busy ? "Đang tạo…" : "Tạo đám cưới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
