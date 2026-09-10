"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminRsvpList } from "@/components/admin/AdminRsvpList";
import { AdminWeddingEditor } from "@/components/admin/AdminWeddingEditor";
import { AdminShell, type AdminTab } from "@/components/admin/AdminShell";
import {
  adminHeaders,
  clearStoredAdminKey,
  getStoredAdminKey,
  setStoredAdminKey,
} from "@/lib/adminClient";

export interface AdminGuestRow {
  id: string;
  name: string;
  order: number;
  index: number;
  url: string;
}

export type StorageMode = "blob" | "file" | "readonly";

export function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<AdminTab>("wedding");
  const [guests, setGuests] = useState<AdminGuestRow[]>([]);
  const [siteUrl, setSiteUrl] = useState("");
  const [storage, setStorage] = useState<StorageMode>("file");
  const [writable, setWritable] = useState(true);
  const [error, setError] = useState("");

  const loadGuests = useCallback(async () => {
    const res = await fetch("/api/admin/guests", {
      headers: adminHeaders(),
      cache: "no-store",
    });
    if (res.status === 401) {
      clearStoredAdminKey();
      setAuthenticated(false);
      return false;
    }
    if (!res.ok) {
      setError("Không tải được danh sách khách.");
      return false;
    }
    const data = await res.json();
    setGuests(data.guests);
    setSiteUrl(data.siteUrl);
    setStorage(data.storage);
    setWritable(data.writable !== false);
    setAuthenticated(true);
    setError("");
    return true;
  }, []);

  useEffect(() => {
    const init = async () => {
      if (getStoredAdminKey()) {
        await loadGuests();
      }
      setReady(true);
    };
    void init();
  }, [loadGuests]);

  const handleLogin = async (password: string) => {
    const authRes = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!authRes.ok) {
      return "Sai mật khẩu.";
    }
    setStoredAdminKey(password);
    const ok = await loadGuests();
    return ok ? null : "Không tải được danh sách khách.";
  };

  const handleLogout = () => {
    clearStoredAdminKey();
    setAuthenticated(false);
    setGuests([]);
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e8dfd0] text-sm text-ink/60">
        Đang tải…
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminShell tab={tab} onTabChange={setTab} onLogout={handleLogout}>
      {tab === "wedding" ? (
        <AdminWeddingEditor />
      ) : tab === "guests" ? (
        <AdminDashboard
          guests={guests}
          siteUrl={siteUrl}
          storage={storage}
          writable={writable}
          error={error}
          onReload={loadGuests}
        />
      ) : (
        <AdminRsvpList />
      )}
    </AdminShell>
  );
}
