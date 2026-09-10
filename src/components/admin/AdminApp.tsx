"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminRsvpList } from "@/components/admin/AdminRsvpList";
import { AdminWeddingEditor } from "@/components/admin/AdminWeddingEditor";
import { AdminShell, type AdminTab, type WeddingSummary } from "@/components/admin/AdminShell";
import { CreateWeddingModal } from "@/components/admin/CreateWeddingModal";
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
  const [weddings, setWeddings] = useState<WeddingSummary[]>([]);
  const [currentSlug, setCurrentSlug] = useState<string>("default");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [guests, setGuests] = useState<AdminGuestRow[]>([]);
  const [siteUrl, setSiteUrl] = useState("");
  const [storage, setStorage] = useState<StorageMode>("file");
  const [writable, setWritable] = useState(true);
  const [error, setError] = useState("");

  const loadWeddings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/weddings", {
        headers: adminHeaders(),
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setWeddings(data.weddings || []);
      }
    } catch {}
  }, []);

  const loadGuests = useCallback(async (slugToLoad?: string) => {
    const slug = slugToLoad !== undefined ? slugToLoad : currentSlug;
    const param = slug && slug !== "default" ? `?slug=${encodeURIComponent(slug)}` : "";
    const res = await fetch(`/api/admin/guests${param}`, {
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
  }, [currentSlug]);

  useEffect(() => {
    const init = async () => {
      if (getStoredAdminKey()) {
        await Promise.all([loadWeddings(), loadGuests("default")]);
      }
      setReady(true);
    };
    void init();
  }, [loadWeddings, loadGuests]);

  useEffect(() => {
    if (authenticated) {
      void loadGuests(currentSlug);
    }
  }, [currentSlug, authenticated, loadGuests]);

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
    await loadWeddings();
    const ok = await loadGuests("default");
    return ok ? null : "Không tải được danh sách khách.";
  };

  const handleLogout = () => {
    clearStoredAdminKey();
    setAuthenticated(false);
    setGuests([]);
    setCurrentSlug("default");
  };

  const handleWeddingCreated = async (newSlug: string) => {
    await loadWeddings();
    setCurrentSlug(newSlug);
  };

  const handleDeleteWedding = async (slugToDelete: string) => {
    try {
      const res = await fetch(`/api/admin/weddings?slug=${encodeURIComponent(slugToDelete)}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (res.ok) {
        await loadWeddings();
        setCurrentSlug("default");
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Không thể xóa đám cưới.");
      }
    } catch {
      alert("Lỗi kết nối khi xóa đám cưới.");
    }
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
    <>
      <AdminShell
        tab={tab}
        onTabChange={setTab}
        onLogout={handleLogout}
        weddings={weddings}
        currentSlug={currentSlug}
        onSlugChange={setCurrentSlug}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onDeleteWedding={handleDeleteWedding}
      >
        {tab === "wedding" ? (
          <AdminWeddingEditor key={currentSlug} slug={currentSlug} />
        ) : tab === "guests" ? (
          <AdminDashboard
            key={currentSlug}
            guests={guests}
            siteUrl={siteUrl}
            storage={storage}
            writable={writable}
            error={error}
            slug={currentSlug}
            onReload={() => loadGuests(currentSlug)}
          />
        ) : (
          <AdminRsvpList key={currentSlug} slug={currentSlug} />
        )}
      </AdminShell>

      <CreateWeddingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleWeddingCreated}
      />
    </>
  );
}
