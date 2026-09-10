import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/adminApi";
import { hasBlobStorage, isVercelRuntime } from "@/lib/jsonPersist";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".webp";
    const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${Date.now()}-${base}${ext}`;

    if (hasBlobStorage()) {
      const { put } = await import("@vercel/blob");
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      const blob = await put(`uploads/${filename}`, buffer, {
        access: "public",
        contentType: file.type || "image/jpeg",
        token,
      });
      return NextResponse.json({ url: blob.url, success: true });
    }

    if (isVercelRuntime()) {
      return NextResponse.json(
        {
          error:
            "Hệ thống đang chạy trên Vercel nhưng chưa kết nối Vercel Blob Storage. Vui lòng vào Vercel Dashboard -> Storage -> Tạo Blob Store để lưu trữ ảnh online.",
        },
        { status: 503 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url, success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi tải ảnh lên";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
