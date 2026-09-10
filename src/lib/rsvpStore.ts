import path from "path";
import type { RsvpRecord, RsvpStatus } from "@/types/wedding";
import { loadJsonStore, saveJsonStore } from "@/lib/jsonPersist";
import { shortId } from "@/lib/utils";

const BLOB_PATHNAME = "wedding-rsvp.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "rsvp.json");

interface RsvpStoreFile {
  responses: RsvpRecord[];
}

function getRsvpPaths(slug?: string) {
  if (slug && slug !== "default") {
    return {
      blobKey: `weddings/${slug}/rsvp.json`,
      localFile: path.join(process.cwd(), "data", "weddings", slug, "rsvp.json"),
    };
  }
  return {
    blobKey: BLOB_PATHNAME,
    localFile: LOCAL_PATH,
  };
}

export async function loadRsvpResponses(slug?: string): Promise<RsvpRecord[]> {
  const { blobKey, localFile } = getRsvpPaths(slug);
  const data = await loadJsonStore<RsvpStoreFile>(blobKey, localFile);
  return data?.responses ?? [];
}

export async function saveRsvpResponses(
  responses: RsvpRecord[],
  slug?: string,
): Promise<void> {
  const { blobKey, localFile } = getRsvpPaths(slug);
  await saveJsonStore(blobKey, localFile, { responses });
}

export function headcountForStatus(status: RsvpStatus): number {
  if (status === "attending_1") return 1;
  if (status === "attending_2") return 2;
  return 0;
}

export function rsvpStatusLabel(status: RsvpStatus): string {
  switch (status) {
    case "attending_1":
      return "Tham dự (1 người)";
    case "attending_2":
      return "Tham dự (2 người)";
    case "declined":
      return "Từ chối";
  }
}

export function findRsvpByGuestKey(
  responses: RsvpRecord[],
  guestId?: string,
  guestName?: string,
): RsvpRecord | null {
  if (guestId) {
    const byId = responses.find(
      (r) => r.guestId?.toLowerCase() === guestId.toLowerCase(),
    );
    if (byId) return byId;
  }
  if (guestName) {
    const key = guestName.toLowerCase();
    return responses.find((r) => r.guestName.toLowerCase() === key) ?? null;
  }
  return null;
}

export async function upsertRsvp(
  input: {
    guestId?: string;
    guestName: string;
    status: RsvpStatus;
  },
  slug?: string,
): Promise<RsvpRecord> {
  const name = input.guestName.replace(/\s+/g, " ").trim();
  if (!name) throw new Error("MISSING_NAME");

  const responses = await loadRsvpResponses(slug);
  const now = new Date().toISOString();
  const existing = findRsvpByGuestKey(responses, input.guestId, name);

  const record: RsvpRecord = {
    id: existing?.id ?? shortId(),
    guestId: input.guestId || existing?.guestId,
    guestName: name,
    status: input.status,
    headcount: headcountForStatus(input.status),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const next = existing
    ? responses.map((r) => (r.id === existing.id ? record : r))
    : [record, ...responses];

  await saveRsvpResponses(next, slug);
  return record;
}
