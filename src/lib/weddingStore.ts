import path from "path";
import fs from "fs/promises";
import { weddingData as defaultWeddingData } from "@/data/wedding";
import type { WeddingData, ThemeConfig } from "@/types/wedding";
import { loadJsonStore, saveJsonStore } from "@/lib/jsonPersist";

const BLOB_PATHNAME = "wedding-content.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "wedding.json");
const TEMPLATES_DIR = path.join(process.cwd(), "data", "templates");
const ACTIVE_TEMPLATE_BLOB_PATHNAME = "active-template.json";
const ACTIVE_TEMPLATE_PATH = path.join(process.cwd(), "data", "active-template.json");

const WEDDINGS_INDEX_BLOB_PATH = "weddings-index.json";
const WEDDINGS_INDEX_LOCAL_PATH = path.join(process.cwd(), "data", "weddings-index.json");

export interface WeddingMeta {
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  template: ThemeConfig["template"];
  createdAt: string;
}

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "images",
  "templates",
  "uploads",
  "fonts",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase().trim());
}

export function cleanSlug(slug: string): string {
  return slug
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DEFAULT_WEDDING_META: WeddingMeta = {
  slug: "default",
  title: "Đám cưới Mặc định (Trang chủ)",
  groomName: "Nguyễn Hữu Thông",
  brideName: "Hoàng Thị Lâm Huyền",
  template: "olive-wax-seal",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export async function listWeddings(): Promise<WeddingMeta[]> {
  try {
    const data = await loadJsonStore<{ weddings?: WeddingMeta[] }>(
      WEDDINGS_INDEX_BLOB_PATH,
      WEDDINGS_INDEX_LOCAL_PATH,
    );
    if (data?.weddings && Array.isArray(data.weddings) && data.weddings.length > 0) {
      if (!data.weddings.some((w) => w.slug === "default")) {
        return [DEFAULT_WEDDING_META, ...data.weddings];
      }
      return data.weddings;
    }
  } catch {}
  return [DEFAULT_WEDDING_META];
}

export async function getWeddingMeta(slug: string): Promise<WeddingMeta | null> {
  const weddings = await listWeddings();
  return weddings.find((w) => w.slug === slug) ?? null;
}

export async function createWedding(input: {
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  template?: ThemeConfig["template"];
}): Promise<WeddingMeta> {
  const slug = cleanSlug(input.slug);
  if (!slug) {
    throw new Error("Đường dẫn (slug) không được để trống.");
  }
  if (isReservedSlug(slug)) {
    throw new Error(`Đường dẫn "${slug}" là từ khóa hệ thống, vui lòng chọn đường dẫn khác.`);
  }

  const existing = await listWeddings();
  if (existing.some((w) => w.slug === slug)) {
    throw new Error(`Đường dẫn "${slug}" đã tồn tại.`);
  }

  const chosenTemplate = input.template || "olive-wax-seal";
  const baseData = await loadWeddingData(chosenTemplate);

  const initialWeddingData: WeddingData = {
    ...baseData,
    groom: {
      ...baseData.groom,
      fullName: input.groomName || baseData.groom.fullName,
      shortName: input.groomName?.split(" ").pop() || input.groomName || baseData.groom.shortName,
    },
    bride: {
      ...baseData.bride,
      fullName: input.brideName || baseData.bride.fullName,
      shortName: input.brideName?.split(" ").pop() || input.brideName || baseData.bride.shortName,
    },
    theme: {
      ...baseData.theme,
      template: chosenTemplate,
    },
  };

  const newMeta: WeddingMeta = {
    slug,
    title: input.title || `${input.groomName} & ${input.brideName}`,
    groomName: input.groomName,
    brideName: input.brideName,
    template: chosenTemplate,
    createdAt: new Date().toISOString(),
  };

  await saveWeddingData(initialWeddingData, chosenTemplate, false, slug);

  const updatedList = [...existing, newMeta];
  await saveJsonStore(WEDDINGS_INDEX_BLOB_PATH, WEDDINGS_INDEX_LOCAL_PATH, {
    weddings: updatedList,
  });

  return newMeta;
}

export async function deleteWedding(slug: string): Promise<boolean> {
  if (slug === "default") {
    throw new Error("Không thể xóa đám cưới mặc định.");
  }
  const existing = await listWeddings();
  const nextList = existing.filter((w) => w.slug !== slug);
  await saveJsonStore(WEDDINGS_INDEX_BLOB_PATH, WEDDINGS_INDEX_LOCAL_PATH, {
    weddings: nextList,
  });
  return true;
}

export async function getActiveTemplate(): Promise<ThemeConfig["template"]> {
  try {
    const saved = await loadJsonStore<{ activeTemplate?: ThemeConfig["template"] }>(
      ACTIVE_TEMPLATE_BLOB_PATHNAME,
      ACTIVE_TEMPLATE_PATH,
    );
    if (saved?.activeTemplate) {
      return saved.activeTemplate;
    }
  } catch {}
  return "olive-wax-seal";
}

export async function setActiveTemplate(templateId: ThemeConfig["template"]): Promise<void> {
  try {
    await saveJsonStore(
      ACTIVE_TEMPLATE_BLOB_PATHNAME,
      ACTIVE_TEMPLATE_PATH,
      { activeTemplate: templateId },
    );
  } catch (err) {
    console.error("Failed to persist active template:", err);
  }
}

export async function loadWeddingData(templateId?: string, slug?: string): Promise<WeddingData> {
  if (slug && slug !== "default") {
    const blobKey = `weddings/${slug}/content.json`;
    const localFile = path.join(process.cwd(), "data", "weddings", slug, "wedding.json");
    try {
      const customData = await loadJsonStore<WeddingData>(blobKey, localFile);
      if (customData?.groom && customData?.bride) {
        if (templateId) {
          return {
            ...customData,
            theme: {
              ...customData.theme,
              template: templateId as ThemeConfig["template"],
            },
          };
        }
        return customData;
      }
    } catch {}
  }

  const targetTemplate = templateId || (await getActiveTemplate());
  const templateFilePath = path.join(TEMPLATES_DIR, `${targetTemplate}.json`);

  try {
    const raw = await fs.readFile(templateFilePath, "utf8");
    const data = JSON.parse(raw) as WeddingData;
    if (data?.groom && data?.bride) {
      return data;
    }
  } catch {}

  const fallback =
    (await loadJsonStore<WeddingData>(BLOB_PATHNAME, LOCAL_PATH)) ??
    defaultWeddingData;

  if (targetTemplate) {
    return {
      ...fallback,
      theme: {
        ...fallback.theme,
        template: targetTemplate as ThemeConfig["template"],
      },
    };
  }

  return fallback;
}

export async function saveWeddingData(
  data: WeddingData,
  templateId?: string,
  setAsActive: boolean = false,
  slug?: string,
) {
  const targetTemplate =
    (templateId || data.theme?.template || (await getActiveTemplate())) as ThemeConfig["template"];

  const cleanData: WeddingData = {
    ...data,
    theme: {
      ...data.theme,
      template: targetTemplate,
    },
  };

  if (slug && slug !== "default") {
    const blobKey = `weddings/${slug}/content.json`;
    const localFile = path.join(process.cwd(), "data", "weddings", slug, "wedding.json");
    await saveJsonStore(blobKey, localFile, cleanData);

    try {
      const weddings = await listWeddings();
      const idx = weddings.findIndex((w) => w.slug === slug);
      if (idx !== -1) {
        weddings[idx] = {
          ...weddings[idx],
          template: targetTemplate,
          groomName: cleanData.groom?.fullName || weddings[idx].groomName,
          brideName: cleanData.bride?.fullName || weddings[idx].brideName,
        };
        await saveJsonStore(WEDDINGS_INDEX_BLOB_PATH, WEDDINGS_INDEX_LOCAL_PATH, {
          weddings,
        });
      }
    } catch {}

    return cleanData;
  }

  try {
    await fs.mkdir(TEMPLATES_DIR, { recursive: true });
    const templateFilePath = path.join(TEMPLATES_DIR, `${targetTemplate}.json`);
    await fs.writeFile(templateFilePath, JSON.stringify(cleanData, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write template file:", err);
  }

  const currentActive = await getActiveTemplate();
  if (setAsActive || targetTemplate === currentActive) {
    await setActiveTemplate(targetTemplate);
    await saveJsonStore(BLOB_PATHNAME, LOCAL_PATH, cleanData);
  }

  return cleanData;
}
