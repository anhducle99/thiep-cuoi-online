"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  readGuestIdFromStorage,
  readGuestIdFromUrl,
  readGuestNameFromStorage,
  writeGuestIdToStorage,
  writeGuestNameToStorage,
} from "@/lib/guestName";

interface GuestNameContextValue {
  guestName: string | null;
  guestId: string | null;
  setGuestName: (name: string) => void;
  clearGuestName: () => void;
}

const GuestNameContext = createContext<GuestNameContextValue | null>(null);

async function resolveGuestFromUrl(slug?: string): Promise<{
  name: string | null;
  id: string | null;
}> {
  if (typeof window === "undefined") return { name: null, id: null };

  const idFromUrl = readGuestIdFromUrl();
  if (idFromUrl) {
    try {
      const slugQuery = slug ? `&slug=${encodeURIComponent(slug)}` : "";
      const res = await fetch(
        `/api/guests/resolve?id=${encodeURIComponent(idFromUrl)}${slugQuery}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = (await res.json()) as { name?: string; id?: string };
        return {
          name: data.name?.trim() || null,
          id: data.id?.trim() || idFromUrl,
        };
      }
    } catch {
      return { name: null, id: idFromUrl };
    }
    return { name: null, id: idFromUrl };
  }

  const to = new URLSearchParams(window.location.search).get("to");
  if (to) {
    return { name: decodeURIComponent(to).replace(/\s+/g, " ").trim(), id: null };
  }

  return { name: null, id: null };
}

export function GuestNameProvider({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug?: string;
}) {
  const [guestName, setGuestNameState] = useState<string | null>(null);
  const [guestId, setGuestIdState] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const fromUrl = await resolveGuestFromUrl(slug);
      const fromStorageName = readGuestNameFromStorage();
      const fromStorageId = readGuestIdFromStorage();

      const name = fromUrl.name ?? fromStorageName;
      const id = fromUrl.id ?? fromStorageId;

      if (!cancelled) {
        if (name) {
          setGuestNameState(name);
          writeGuestNameToStorage(name);
        }
        if (id) {
          setGuestIdState(id);
          writeGuestIdToStorage(id);
        }
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const setGuestName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setGuestNameState(trimmed);
    writeGuestNameToStorage(trimmed);
  }, []);

  const clearGuestName = useCallback(() => {
    setGuestNameState(null);
    setGuestIdState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("invitation-guest-name");
      localStorage.removeItem("invitation-guest-id");
    }
  }, []);

  const value = useMemo(
    () => ({
      guestName,
      guestId,
      setGuestName,
      clearGuestName,
    }),
    [guestName, guestId, setGuestName, clearGuestName],
  );

  return (
    <GuestNameContext.Provider value={value}>{children}</GuestNameContext.Provider>
  );
}

export function useGuestName() {
  const ctx = useContext(GuestNameContext);
  if (!ctx) {
    throw new Error("useGuestName must be used within GuestNameProvider");
  }
  return ctx;
}
