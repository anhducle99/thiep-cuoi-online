"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminHeaders } from "@/lib/adminClient";

interface RsvpRow {
  id: string;
  guestId?: string;
  guestName: string;
  status: string;
  statusLabel: string;
  headcount: number;
  updatedAt: string;
}

interface RsvpStats {
  total: number;
  attending: number;
  declined: number;
  headcount: number;
}

export function AdminRsvpList({ slug }: { slug?: string }) {
  const [rows, setRows] = useState<RsvpRow[]>([]);
  const [stats, setStats] = useState<RsvpStats | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const param = slug && slug !== "default" ? `?slug=${encodeURIComponent(slug)}` : "";
    const res = await fetch(`/api/admin/rsvp${param}`, {
      headers: adminHeaders(),
      cache: "no-store",
    });
    if (!res.ok) {
      setError("Không tải được danh sách xác nhận.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setRows(data.responses);
    setStats(data.stats);
    setError("");
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.guestName.toLowerCase().includes(q) ||
        r.statusLabel.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  if (loading) {
    return <p className="text-center text-sm text-ink/60">Đang tải…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Đã phản hồi", value: stats.total },
            { label: "Tham dự", value: stats.attending },
            { label: "Từ chối", value: stats.declined },
            { label: "Tổng người", value: stats.headcount },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gold/25 bg-cream-light px-3 py-3 text-center"
            >
              <p className="text-xl font-semibold text-crimson">{s.value}</p>
              <p className="text-xs text-ink/55">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 flex gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm tên khách…"
          className="min-w-0 flex-1 rounded-lg border border-gold/40 bg-cream-light px-3 py-2.5 text-sm outline-none focus:border-wine"
        />
        <button
          type="button"
          onClick={() => void load()}
          className="shrink-0 rounded-lg border border-wine/30 bg-cream-light px-4 py-2.5 text-sm text-crimson"
        >
          Làm mới
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gold/25 bg-cream-light shadow-sm">
        <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-ink/10 bg-wine/5 px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink/50 sm:grid">
          <span>Tên khách</span>
          <span>Trạng thái</span>
          <span>Số người</span>
          <span>Thời gian</span>
        </div>
        <ul className="max-h-[65vh] divide-y divide-ink/8 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-ink/50">
              Chưa có ai xác nhận tham dự.
            </li>
          ) : (
            filtered.map((row, i) => (
              <li
                key={row.id}
                className="flex flex-col gap-1 px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-3"
              >
                <div>
                  <span className="mr-2 text-xs text-ink/35 sm:hidden">
                    #{i + 1}
                  </span>
                  <span className="font-serif text-sm text-ink">{row.guestName}</span>
                </div>
                <span
                  className={
                    row.headcount > 0
                      ? "text-xs font-medium text-green-800"
                      : "text-xs font-medium text-ink/50"
                  }
                >
                  {row.statusLabel}
                </span>
                <span className="text-xs text-ink/60">{row.headcount}</span>
                <span className="text-xs text-ink/45">{formatDate(row.updatedAt)}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
