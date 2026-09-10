import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { loadRsvpResponses, rsvpStatusLabel } from "@/lib/rsvpStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") || undefined;

  const responses = await loadRsvpResponses(slug);
  const sorted = [...responses].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const stats = {
    total: sorted.length,
    attending: sorted.filter((r) => r.headcount > 0).length,
    declined: sorted.filter((r) => r.status === "declined").length,
    headcount: sorted.reduce((sum, r) => sum + r.headcount, 0),
  };

  return NextResponse.json({
    responses: sorted.map((r) => ({
      ...r,
      statusLabel: rsvpStatusLabel(r.status),
    })),
    stats,
  });
}
