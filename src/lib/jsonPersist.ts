import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { BLOB_SETUP_MESSAGE } from "@/lib/persistMessages";

export class BlobNotConfiguredError extends Error {
  constructor() {
    super("BLOB_NOT_CONFIGURED");
    this.name = "BlobNotConfiguredError";
  }
}

export class PersistWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersistWriteError";
  }
}

export function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1";
}

function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export function hasBlobStorage(): boolean {
  return !!getBlobToken();
}

export function getStorageMode(): "blob" | "file" | "readonly" {
  if (hasBlobStorage()) return "blob";
  if (isVercelRuntime()) return "readonly";
  return "file";
}

export function assertCanPersist(): void {
  if (isVercelRuntime() && !hasBlobStorage()) {
    throw new BlobNotConfiguredError();
  }
}

async function loadBlobModule() {
  return import("@vercel/blob");
}

async function readJsonFromBlob<T>(pathname: string): Promise<T | null> {
  const token = getBlobToken();
  if (!token) return null;

  try {
    const { get } = await loadBlobModule();
    const result = await get(pathname, {
      access: "private",
      token,
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function writeJsonToBlob<T>(pathname: string, data: T): Promise<void> {
  const token = getBlobToken();
  if (!token) {
    throw new BlobNotConfiguredError();
  }

  try {
    const { put } = await loadBlobModule();
    await put(pathname, JSON.stringify(data, null, 2), {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
      token,
    });
  } catch (err) {
    const detail =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    throw new PersistWriteError(detail);
  }
}

function readJsonFromFile<T>(filePath: string): T | null {
  if (isVercelRuntime()) return null;
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

function writeJsonToFile<T>(filePath: string, data: T): void {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function loadJsonStore<T>(
  blobPathname: string,
  localPath: string,
): Promise<T | null> {
  const fromBlob = await readJsonFromBlob<T>(blobPathname);
  if (fromBlob !== null) return fromBlob;
  return readJsonFromFile<T>(localPath);
}

export async function saveJsonStore<T>(
  blobPathname: string,
  localPath: string,
  data: T,
): Promise<"blob" | "file"> {
  if (hasBlobStorage()) {
    await writeJsonToBlob(blobPathname, data);
    return "blob";
  }

  assertCanPersist();

  try {
    writeJsonToFile(localPath, data);
    return "file";
  } catch (err) {
    const msg = err instanceof Error ? err.message : "File write failed";
    throw new PersistWriteError(msg);
  }
}

export function toPersistErrorResponse(err: unknown): {
  status: number;
  error: string;
} {
  const message = err instanceof Error ? err.message : String(err);

  if (
    err instanceof BlobNotConfiguredError ||
    message === "BLOB_NOT_CONFIGURED"
  ) {
    return { status: 503, error: BLOB_SETUP_MESSAGE };
  }

  if (err instanceof PersistWriteError) {
    return {
      status: 500,
      error: `Không lưu được dữ liệu (${message}).`,
    };
  }

  return {
    status: 500,
    error: `Lỗi máy chủ: ${message}`,
  };
}

export { BLOB_SETUP_MESSAGE };
