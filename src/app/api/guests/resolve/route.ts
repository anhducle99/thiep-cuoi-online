import { NextResponse } from "next/server";
import { loadGuests, resolveGuestFromList } from "@/lib/guestStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug") || undefined;

  if (!id) {
    return NextResponse.json({ error: "Thiếu id khách mời." }, { status: 400 });
  }

  const guests = await loadGuests(slug);
  const guest = resolveGuestFromList(guests, id);

  if (!guest) {
    return NextResponse.json({ error: "Không tìm thấy khách." }, { status: 404 });
  }

  return NextResponse.json({ id: guest.id, name: guest.name });
}
