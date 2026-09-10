import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { getStorageMode, toPersistErrorResponse } from "@/lib/jsonPersist";
import { loadWeddingData, saveWeddingData, getActiveTemplate, setActiveTemplate } from "@/lib/weddingStore";
import type { WeddingData, ThemeConfig } from "@/types/wedding";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const template = url.searchParams.get("template") || undefined;
  const slug = url.searchParams.get("slug") || undefined;
  const activeTemplate = await getActiveTemplate();

  return NextResponse.json({
    wedding: await loadWeddingData(template, slug),
    activeTemplate,
    storage: getStorageMode(),
  });
}

export async function PUT(request: Request) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;

    const url = new URL(request.url);
    const slugFromQuery = url.searchParams.get("slug") || undefined;

    const body = (await request.json().catch(() => null));
    const data = (body?.wedding ?? body) as WeddingData | null;
    const templateId = (body?.templateId || data?.theme?.template) as string | undefined;
    const setAsActive = Boolean(body?.setAsActive);
    const slug = body?.slug || slugFromQuery;

    if (body?.setActiveOnly && templateId) {
      await setActiveTemplate(templateId as ThemeConfig["template"]);
      return NextResponse.json({ activeTemplate: templateId, success: true });
    }

    if (!data?.groom?.fullName || !data?.bride?.fullName) {
      return NextResponse.json(
        { error: "Tên cô dâu và chú rể không được để trống." },
        { status: 400 },
      );
    }

    const saved = await saveWeddingData(data, templateId, setAsActive, slug);
    const activeTemplate = await getActiveTemplate();
    return NextResponse.json({ wedding: saved, activeTemplate, success: true });
  } catch (err) {
    const { status, error } = toPersistErrorResponse(err);
    return NextResponse.json({ error }, { status });
  }
}
