"use client";

import { useMemo, useState } from "react";
import type { AdminGuestRow, StorageMode } from "@/components/admin/AdminApp";
import { BLOB_SETUP_MESSAGE } from "@/lib/persistMessages";
import { adminHeaders } from "@/lib/adminClient";

interface AdminDashboardProps {
  guests: AdminGuestRow[];
  siteUrl: string;
  storage: StorageMode;
  writable: boolean;
  error?: string;
  slug?: string;
  onReload: () => Promise<boolean>;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function AdminDashboard({
  guests,
  siteUrl,
  storage,
  writable,
  error,
  slug,
  onReload,
}: AdminDashboardProps) {
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const getGuestUrl = (guest: AdminGuestRow) => {
    const base = siteUrl || "https://xuanphu.vercel.app";
    const pathPrefix = slug && slug !== "default" ? `/${slug}` : "";
    return `${base}${pathPrefix}?id=${encodeURIComponent(guest.id)}`;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) || g.id.toLowerCase().includes(q),
    );
  }, [guests, query]);

  const notify = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const handleCopy = async (guest: AdminGuestRow) => {
    const ok = await copyText(getGuestUrl(guest));
    if (ok) {
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    const text = filtered.map((g) => `${g.name}\t${getGuestUrl(g)}`).join("\n");
    await copyText(text);
    setCopiedId("__all__");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    const res = await fetch("/api/admin/guests", {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({ name, slug: slug !== "default" ? slug : undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      notify(
        data.error ??
          `Lỗi ${res.status}: không thêm được khách. Kiểm tra Vercel Blob đã Connect chưa.`,
      );
      return;
    }
    setNewName("");
    notify(`Đã thêm: ${data.guest.name}`);
    await onReload();
  };

  const startEdit = (guest: AdminGuestRow) => {
    setEditingId(guest.id);
    setEditName(guest.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleSaveEdit = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    setBusy(true);
    const res = await fetch(`/api/admin/guests/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ name, slug: slug !== "default" ? slug : undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      notify(data.error ?? "Không cập nhật được.");
      return;
    }
    cancelEdit();
    notify("Đã cập nhật tên khách.");
    await onReload();
  };

  const handleDelete = async (guest: AdminGuestRow) => {
    const ok = window.confirm(`Xóa khách "${guest.name}"? Link cũ sẽ không còn hoạt động.`);
    if (!ok) return;
    setBusy(true);
    const param = slug && slug !== "default" ? `?slug=${encodeURIComponent(slug)}` : "";
    const res = await fetch(`/api/admin/guests/${encodeURIComponent(guest.id)}${param}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      notify(data.error ?? "Không xóa được.");
      return;
    }
    notify("Đã xóa khách.");
    await onReload();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h2 className="font-serif text-xl font-semibold text-crimson">
          {slug && slug !== "default" ? `Link mời khách: /${slug}` : "Link mời khách"}
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          {slug && slug !== "default"
            ? "Tạo link mời riêng cho từng khách của đám cưới này (tự động gắn tên khách vào thiệp)"
            : "Thêm · Sửa · Xóa · Copy link mời từng khách"}
        </p>
        <p className="mt-2 text-xs text-ink/45">
          {siteUrl}{slug && slug !== "default" ? `/${slug}` : ""} · {guests.length} khách · lưu trữ: {storage}
        </p>
        {!writable && (
          <div className="mt-3 rounded-lg border border-amber-500/50 bg-amber-50 px-3 py-2.5 text-left text-xs leading-relaxed text-amber-950">
            <strong className="block font-semibold">Không thể lưu thay đổi trên Vercel</strong>
            {BLOB_SETUP_MESSAGE}
          </div>
        )}
      </header>

        {(error || message) && (
          <p className={`mb-4 text-sm ${error ? "text-red-700" : "text-crimson"}`}>
            {error || message}
          </p>
        )}

        <form
          onSubmit={handleAdd}
          className="mb-4 flex flex-col gap-2 rounded-xl border border-gold/25 bg-cream-light p-4 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1">
            <label className="text-xs font-medium uppercase tracking-wide text-ink/50">
              Thêm khách mới
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Vd: Anh Hiếu Nguyễn"
              className="mt-1 w-full rounded-lg border border-gold/40 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-wine"
              disabled={busy}
            />
          </div>
          <button
            type="submit"
            disabled={busy || !newName.trim() || !writable}
            className="rounded-lg bg-wine px-5 py-2.5 text-sm text-cream-light disabled:opacity-50"
          >
            Thêm
          </button>
        </form>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm tên hoặc id…"
            className="min-w-0 flex-1 rounded-lg border border-gold/40 bg-cream-light px-3 py-2.5 text-sm outline-none focus:border-wine"
          />
          <button
            type="button"
            onClick={handleCopyAll}
            className="shrink-0 rounded-lg border border-wine/30 bg-cream-light px-4 py-2.5 text-sm text-crimson transition hover:bg-wine/10"
          >
            {copiedId === "__all__" ? "Đã copy!" : "Copy danh sách"}
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gold/25 bg-cream-light shadow-sm">
          <ul className="max-h-[65vh] divide-y divide-ink/8 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-ink/50">
                Không có khách nào.
              </li>
            ) : (
              filtered.map((guest) => (
                <li key={guest.id} className="px-4 py-3">
                  <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[2rem_1fr_auto] sm:items-start sm:gap-3">
                    <span className="text-xs text-ink/40">{guest.index}</span>

                    <div className="min-w-0">
                      {editingId === guest.id ? (
                        <div className="flex flex-wrap gap-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="min-w-0 flex-1 rounded-lg border border-gold/40 px-3 py-1.5 text-sm outline-none focus:border-wine"
                            disabled={busy}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(guest.id)}
                            disabled={busy}
                            className="rounded-lg bg-wine px-3 py-1.5 text-xs text-cream-light"
                          >
                            Lưu
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-lg border border-ink/20 px-3 py-1.5 text-xs text-ink/60"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <p className="font-serif text-sm text-ink">{guest.name}</p>
                      )}
                      <a
                        href={getGuestUrl(guest)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block break-all text-xs text-ink/60 hover:text-wine hover:underline"
                      >
                        {getGuestUrl(guest)} ↗
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(guest)}
                        className="rounded-lg bg-wine px-3 py-1.5 text-xs text-cream-light"
                      >
                        {copiedId === guest.id ? "Đã copy!" : "Copy"}
                      </button>
                      {editingId !== guest.id && (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(guest)}
                            className="rounded-lg border border-wine/30 px-3 py-1.5 text-xs text-crimson"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(guest)}
                            disabled={busy}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-700"
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
    </div>
  );
}
