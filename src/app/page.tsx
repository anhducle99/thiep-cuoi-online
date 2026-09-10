import { InvitationView } from "@/components/InvitationView";
import { loadWeddingData } from "@/lib/weddingStore";
import type { ThemeConfig } from "@/types/wedding";

export const dynamic = "force-dynamic";

const TEMPLATE_IDS: ThemeConfig["template"][] = [
  "olive-wax-seal",
  "holymaiden-rose",
  "luxury-gold-black",
  "song-hy-do",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const requestedTemplate = (await searchParams).template;
  const validTemplate = TEMPLATE_IDS.includes(
    requestedTemplate as ThemeConfig["template"],
  )
    ? (requestedTemplate as ThemeConfig["template"])
    : undefined;

  const weddingData = await loadWeddingData(validTemplate);
  return <InvitationView data={weddingData} />;
}
