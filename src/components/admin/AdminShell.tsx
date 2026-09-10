"use client";

import Link from "next/link";

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
  const tabs: { id: AdminTab; label: string }[] = [
    { id: "wedding", label: "Mẫu thiệp & Nội dung" },
    { id: "guests", label: "Link khách mời" },
    { id: "rsvp", label: "Xác nhận tham dự" },
  ];

  const currentWedding = weddings.find((w) => w.slug === currentSlug);
  const isDefault = currentSlug === "default";
  const viewUrl = isDefault ? "/" : `/${currentSlug}`;

  const handleDelete = () => {
    if (isDefault) return;
    const ok = window.confirm(
      `Bạn có chắc muốn xóa đám cưới "/${currentSlug}" (${currentWedding?.title || currentSlug})?\nDữ liệu khách mời và cấu hình của cặp đôi này sẽ bị gỡ bỏ.`,
    );
    if (ok && onDeleteWedding) {
      onDeleteWedding(currentSlug);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8dfd0]">
      <header className="sticky top-0 z-30 border-b border-gold/25 bg-cream-light/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-lg font-bold text-crimson">
              Admin Thiệp Cưới
            </h1>
            <span className="hidden text-xs text-gold/60 sm:inline">|</span>
            <div className="flex items-center gap-2">
              <label htmlFor="wedding-select" className="text-xs font-medium text-ink/70">
                Đám cưới:
              </label>
              <select
                id="wedding-select"
                value={currentSlug}
                onChange={(e) => onSlugChange(e.target.value)}
                className="rounded-lg border border-gold/40 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink shadow-sm outline-none focus:border-wine focus:ring-1 focus:ring-wine"
              >
                <option value="default">⭐ Mặc định (Trang chủ /)</option>
                {weddings.map((w) => (
                  <option key={w.slug} value={w.slug}>
                    💑 {w.groomName} & {w.brideName} (/{w.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              + Tạo đám cưới mới
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="shrink-0 rounded-lg border border-ink/20 px-3 py-1.5 text-xs text-ink/60 hover:bg-white/50 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="border-t border-gold/15 bg-amber-50/60 px-4 py-2">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-ink/80">
              <span className="font-medium">Đang quản lý:</span>
              <span className="font-bold text-wine">
                {isDefault
                  ? "Đám cưới Mặc định (Trang chủ)"
                  : `${currentWedding?.groomName || "Chú rể"} & ${currentWedding?.brideName || "Cô dâu"}`}
              </span>
              <span className="rounded bg-wine/10 px-1.5 py-0.5 font-mono text-[11px] text-wine">
                {isDefault ? "/" : `/${currentSlug}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-wine hover:underline"
              >
                <span>👁️ Mở xem thiệp</span>
                <span className="text-[10px]">↗</span>
              </Link>

              {!isDefault && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="font-medium text-red-600 hover:text-red-800 hover:underline"
                >
                  🗑️ Xóa đám cưới này
                </button>
              )}
            </div>
          </div>
        </div>

        <nav className="mx-auto flex max-w-4xl gap-1 px-4 py-2.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={
                tab === t.id
                  ? "rounded-full bg-wine px-4 py-1.5 text-xs font-medium text-cream-light shadow-sm"
                  : "rounded-full px-4 py-1.5 text-xs text-ink/70 hover:bg-white/50 transition-colors"
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="px-4 py-6">{children}</main>
    </div>
  );
}
