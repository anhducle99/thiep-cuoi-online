import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import {
  guestsToInvites,
  loadGuests,
  nextGuestSlot,
  saveGuests,
  batchAddGuests,
} from "@/lib/guestStore";
import { getSiteBaseUrl } from "@/lib/guestInvite";
import { getStorageMode, toPersistErrorResponse } from "@/lib/jsonPersist";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") || undefined;

    const guests = await loadGuests(slug);
    const siteUrl = getSiteBaseUrl();
    const invites = guestsToInvites(guests, siteUrl, slug);
    const storage = getStorageMode();

    return NextResponse.json({
      guests: invites,
      siteUrl,
      storage,
      writable: storage !== "readonly",
      hasBlobToken: storage === "blob",
    });
  } catch (err) {
    console.error("[GET /api/admin/guests]", err);
    const { status, error } = toPersistErrorResponse(err);
    return NextResponse.json({ error }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;

    const url = new URL(request.url);
    const slugFromQuery = url.searchParams.get("slug") || undefined;

    const body = (await request.json().catch(() => null)) as
      | { name?: string; names?: string[]; group?: string; slug?: string }
      | null;

    const slug = body?.slug || slugFromQuery;

    if (Array.isArray(body?.names)) {
      const validNames = body.names
        .map((n) => (typeof n === "string" ? n.replace(/\s+/g, " ").trim() : ""))
        .filter((n) => n.length > 0);

      if (validNames.length === 0) {
        return NextResponse.json(
          { error: "Danh sách tên khách rỗng." },
          { status: 400 },
        );
      }

      const guests = await loadGuests(slug);
      const { nextGuests, added, duplicates } = batchAddGuests(guests, validNames);

      if (added.length > 0) {
        await saveGuests(nextGuests, slug);
      }

      const siteUrl = getSiteBaseUrl();
      const invites = guestsToInvites(added, siteUrl, slug);

      return NextResponse.json(
        {
          success: true,
          addedCount: added.length,
          duplicateCount: duplicates.length,
          duplicates,
          guests: invites,
          total: nextGuests.length,
        },
        { status: 201 },
      );
    }

    const name = body?.name?.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên khách." },
        { status: 400 },
      );
    }

    const guests = await loadGuests(slug);
    const duplicate = guests.some(
      (g) => g.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      return NextResponse.json(
        { error: "Tên khách đã tồn tại." },
        { status: 409 },
      );
    }

    const record = nextGuestSlot(guests, name, body?.group);
    const next = [...guests, record];
    await saveGuests(next, slug);

    const siteUrl = getSiteBaseUrl();
    const [invite] = guestsToInvites([record], siteUrl, slug);

    return NextResponse.json({ guest: invite }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/guests]", err);
    const { status, error } = toPersistErrorResponse(err);
    return NextResponse.json({ error }, { status });
  }
}
