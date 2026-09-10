"use client";

export type AdminTab = "wedding" | "guests" | "rsvp";

export function AdminShell({
  tab,
  onTabChange,
  onLogout,
  children,
}: {
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const tabs: { id: AdminTab; label: string }[] = [
    { id: "wedding", label: "Mẫu thiệp (9)" },
    { id: "guests", label: "Link khách mời" },
    { id: "rsvp", label: "Xác nhận tham dự" },
  ];

  return (
    <div className="min-h-screen bg-[#e8dfd0]">
      <header className="sticky top-0 z-10 border-b border-gold/25 bg-cream-light/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <h1 className="font-serif text-lg font-semibold text-crimson">
            Admin thiệp cưới
          </h1>
          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-lg border border-ink/20 px-3 py-1.5 text-xs text-ink/60 hover:bg-white/50"
          >
            Đăng xuất
          </button>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 px-4 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={
                tab === t.id
                  ? "rounded-full bg-wine px-4 py-2 text-xs font-medium text-cream-light"
                  : "rounded-full px-4 py-2 text-xs text-ink/60 hover:bg-white/50"
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <div className="px-4 py-6">{children}</div>
    </div>
  );
}
