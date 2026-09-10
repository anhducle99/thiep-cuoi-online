import path from "path";
import type { Wish } from "@/types/wedding";
import { loadJsonStore, saveJsonStore } from "@/lib/jsonPersist";
import { shortId } from "@/lib/utils";

const BLOB_PATHNAME = "wedding-wishes.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "wishes.json");

interface WishesStoreFile {
  wishes: Wish[];
}

function getWishesPaths(slug?: string) {
  if (slug && slug !== "default") {
    return {
      blobKey: `weddings/${slug}/wishes.json`,
      localFile: path.join(process.cwd(), "data", "weddings", slug, "wishes.json"),
    };
  }
  return {
    blobKey: BLOB_PATHNAME,
    localFile: LOCAL_PATH,
  };
}

export async function loadWishes(slug?: string): Promise<Wish[]> {
  const { blobKey, localFile } = getWishesPaths(slug);
  const data = await loadJsonStore<WishesStoreFile>(blobKey, localFile);
  return data?.wishes ?? [];
}

export async function saveWishes(wishes: Wish[], slug?: string): Promise<void> {
  const { blobKey, localFile } = getWishesPaths(slug);
  await saveJsonStore(blobKey, localFile, { wishes });
}

export async function addWish(
  input: {
    name: string;
    message: string;
    invitedAs?: string;
  },
  slug?: string,
): Promise<Wish> {
  const wishes = await loadWishes(slug);
  const wish: Wish = {
    id: shortId(),
    name: input.name.trim(),
    message: input.message.trim(),
    invitedAs: input.invitedAs?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const next = [wish, ...wishes];
  await saveWishes(next, slug);
  return wish;
}

