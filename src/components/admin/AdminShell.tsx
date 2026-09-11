"use client";

import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";

export type AdminTab = "wedding" | "guests" | "rsvp";

export interface WeddingSummary {
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  template: string;
  createdAt?: string;
}

interface AdminShellProps {
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  weddings: WeddingSummary[];
  currentSlug: string;
  onSlugChange: (slug: string) => void;
  onOpenCreateModal: () => void;
  onDeleteWedding?: (slug: string) => void;
  children: React.ReactNode;
}

export function AdminShell({
  tab,
  onTabChange,
  onLogout,
  weddings,
  currentSlug,
  onSlugChange,
  onOpenCreateModal,
  onDeleteWedding,
  children,
}: AdminShellProps) {
  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "wedding", label: "Mẫu thiệp & Nội dung", icon: "🎨" },
    { id: "guests", label: "Link khách mời", icon: "👥" },
    { id: "rsvp", label: "Xác nhận tham dự", icon: "💌" },
  ];

  const currentWedding = weddings.find((w) => w.slug === currentSlug);
  const isDefault = currentSlug === "default";
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    if (isDefault) return;
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#e8dfd0]">
      <header className="sticky top-0 z-30 border-b border-gold/25 bg-cream-light/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-1.5 font-serif text-base sm:text-lg font-bold text-crimson tracking-tight shrink-0">
            <span>💍</span>
            <span>Admin Thiệp Cưới</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              <span>+</span>
              <span className="hidden sm:inline">Tạo đám cưới mới</span>
              <span className="sm:hidden">Tạo mới</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs text-ink/60 hover:bg-white/80 hover:text-ink transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="border-t border-gold/15 bg-white/50">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2.5 px-4 py-2">
            <nav className="flex items-center gap-1 sm:gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange(t.id)}
                  className={
                    tab === t.id
                      ? "inline-flex items-center gap-1.5 rounded-full bg-wine px-3.5 py-1.5 text-xs font-semibold text-cream-light shadow-sm transition-all"
                      : "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-ink/70 hover:bg-white/70 hover:text-ink transition-all"
                  }
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-white px-2.5 py-1 shadow-sm">
              <span className="text-[11px] font-bold text-wine uppercase tracking-wider">
                Đám cưới:
              </span>
              <select
                id="wedding-select"
                value={currentSlug}
                onChange={(e) => onSlugChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-ink outline-none cursor-pointer max-w-[200px] sm:max-w-[280px] truncate"
              >
                <option value="default">⭐ Mặc định (Trang chủ /)</option>
                {weddings
                  .filter((w) => w.slug !== "default")
                  .map((w) => (
                    <option key={w.slug} value={w.slug}>
                      💑 {w.groomName} & {w.brideName} (/{w.slug})
                    </option>
                  ))}
              </select>

              {!isDefault && (
                <button
                  type="button"
                  onClick={handleDelete}
                  title="Xóa đám cưới này"
                  className="rounded p-1 text-ink/40 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <span className="text-xs">🗑️</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">{children}</main>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa đám cưới"
        message={`Bạn có chắc muốn xóa đám cưới "/${currentSlug}" (${currentWedding?.title || currentSlug})?`}
        description="Lưu ý: Toàn bộ danh sách khách mời, phản hồi tham dự và nội dung thiệp của cặp đôi này sẽ bị xóa hoàn toàn."
        confirmText="Xóa vĩnh viễn"
        cancelText="Huỷ"
        variant="danger"
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          if (onDeleteWedding) {
            onDeleteWedding(currentSlug);
          }
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
