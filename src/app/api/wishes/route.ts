import { NextResponse } from "next/server";
import { loadWishes, addWish } from "@/lib/wishesStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || undefined;
  const wishes = await loadWishes(slug);
  return NextResponse.json({ wishes });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = (await request.json().catch(() => null)) as
    | { name?: string; message?: string; invitedAs?: string; slug?: string }
    | null;

  const slug = body?.slug || searchParams.get("slug") || undefined;

  if (!body?.name?.trim() || !body?.message?.trim()) {
    return NextResponse.json(
      { error: "Vui lòng nhập tên và lời chúc." },
      { status: 400 },
    );
  }

  const wish = await addWish(
    {
      name: body.name.trim(),
      message: body.message.trim(),
      invitedAs: body.invitedAs?.trim() || undefined,
    },
    slug,
  );

  return NextResponse.json({ wish }, { status: 201 });
}
