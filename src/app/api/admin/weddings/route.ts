import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { listWeddings, createWedding, deleteWedding } from "@/lib/weddingStore";
import { toPersistErrorResponse } from "@/lib/jsonPersist";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const weddings = await listWeddings();
  return NextResponse.json({ weddings });
}

export async function POST(request: Request) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;

    const body = await request.json().catch(() => null);
    if (!body?.slug || !body?.groomName || !body?.brideName) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ: Tên chú rể, Tên cô dâu và Đường dẫn (slug)." },
        { status: 400 },
      );
    }

    const created = await createWedding({
      slug: body.slug,
      title: body.title || `${body.groomName} & ${body.brideName}`,
      groomName: body.groomName,
      brideName: body.brideName,
      template: body.template,
    });

    return NextResponse.json({ success: true, wedding: created }, { status: 201 });
  } catch (err: any) {
    const message = err?.message || "Không thể tạo đám cưới.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Thiếu slug đám cưới." }, { status: 400 });
    }

    await deleteWedding(slug);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const message = err?.message || "Không thể xóa đám cưới.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

