import path from "path";
import { buildGuestInviteId } from "@/lib/guestInvite";
import {
  BlobNotConfiguredError,
  PersistWriteError,
  loadJsonStore,
  saveJsonStore,
} from "@/lib/jsonPersist";
import { guestList as SEED_NAMES } from "@/data/guests";

const BLOB_PATHNAME = "wedding-guests.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "guests.json");

export interface GuestRecord {
  id: string;
  name: string;
  order: number;
  group?: string;
}

interface GuestStoreFile {
  guests: GuestRecord[];
}

export { BlobNotConfiguredError, PersistWriteError };

function normalizeName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}

function buildSeedGuests(): GuestRecord[] {
  return SEED_NAMES.map((name, i) => ({
    id: buildGuestInviteId(name, i + 1),
    name: normalizeName(name),
    order: i + 1,
  }));
}

function sortGuests(guests: GuestRecord[]): GuestRecord[] {
  return [...guests].sort((a, b) => a.order - b.order);
}

function getGuestPaths(slug?: string) {
  if (slug && slug !== "default") {
    return {
      blobKey: `weddings/${slug}/guests.json`,
      localFile: path.join(process.cwd(), "data", "weddings", slug, "guests.json"),
    };
  }
  return {
    blobKey: BLOB_PATHNAME,
    localFile: LOCAL_PATH,
  };
}

export async function loadGuests(slug?: string): Promise<GuestRecord[]> {
  const { blobKey, localFile } = getGuestPaths(slug);
  const data = await loadJsonStore<GuestStoreFile>(blobKey, localFile);

  if (data?.guests && Array.isArray(data.guests)) {
    return sortGuests(data.guests);
  }

  if (slug && slug !== "default") {
    return [];
  }

  const seed = buildSeedGuests();
  try {
    await saveJsonStore(blobKey, localFile, { guests: seed });
  } catch {}
  return seed;
}

export async function saveGuests(
  guests: GuestRecord[],
  slug?: string,
): Promise<"blob" | "file"> {
  const { blobKey, localFile } = getGuestPaths(slug);
  const sorted = sortGuests(guests);
  return saveJsonStore(blobKey, localFile, { guests: sorted });
}

export function resolveGuestFromList(
  guests: GuestRecord[],
  id: string,
): GuestRecord | null {
  const key = id.trim().toLowerCase();
  return guests.find((g) => g.id.toLowerCase() === key) ?? null;
}

export function nextGuestSlot(
  guests: GuestRecord[],
  name: string,
  group?: string,
): GuestRecord {
  const normalized = normalizeName(name);
  const maxOrder = guests.reduce((max, g) => Math.max(max, g.order), 0);
  const order = maxOrder + 1;
  let id = buildGuestInviteId(normalized, order);
  let suffix = order;
  while (guests.some((g) => g.id.toLowerCase() === id.toLowerCase())) {
    suffix += 1;
    id = buildGuestInviteId(normalized, suffix);
  }
  return { id, name: normalized, order, group };
}

export function guestsToInvites(
  guests: GuestRecord[],
  baseUrl: string,
  slug?: string,
): Array<GuestRecord & { url: string; index: number }> {
  const prefix = slug && slug !== "default" ? `${baseUrl.replace(/\/$/, "")}/${slug}` : baseUrl.replace(/\/$/, "");
  return sortGuests(guests).map((g, i) => ({
    ...g,
    index: i + 1,
    url: `${prefix}/?id=${encodeURIComponent(g.id)}`,
  }));
}
