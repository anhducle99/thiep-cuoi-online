import path from "path";
import fs from "fs/promises";
import { weddingData as defaultWeddingData } from "@/data/wedding";
import type { WeddingData, ThemeConfig } from "@/types/wedding";
import { loadJsonStore, saveJsonStore } from "@/lib/jsonPersist";

const BLOB_PATHNAME = "wedding-content.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "wedding.json");
const TEMPLATES_DIR = path.join(process.cwd(), "data", "templates");
const ACTIVE_TEMPLATE_PATH = path.join(process.cwd(), "data", "active-template.json");

export async function getActiveTemplate(): Promise<ThemeConfig["template"]> {
  try {
    const raw = await fs.readFile(ACTIVE_TEMPLATE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.activeTemplate || "olive-wax-seal";
  } catch {
    return "olive-wax-seal";
  }
}

export async function setActiveTemplate(templateId: ThemeConfig["template"]): Promise<void> {
  try {
    await fs.writeFile(
      ACTIVE_TEMPLATE_PATH,
      JSON.stringify({ activeTemplate: templateId }, null, 2),
      "utf8",
    );
  } catch {
    // Ignore error
  }
}

export async function loadWeddingData(templateId?: string): Promise<WeddingData> {
  const targetTemplate = templateId || (await getActiveTemplate());
  const templateFilePath = path.join(TEMPLATES_DIR, `${targetTemplate}.json`);

  try {
    const raw = await fs.readFile(templateFilePath, "utf8");
    const data = JSON.parse(raw) as WeddingData;
    if (data?.groom && data?.bride) {
      return data;
    }
  } catch {
    // Fallback if template file doesn't exist
  }

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
