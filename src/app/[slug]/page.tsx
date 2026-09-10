import { notFound } from "next/navigation";
import { InvitationView } from "@/components/InvitationView";
import { loadWeddingData, isReservedSlug, getWeddingMeta } from "@/lib/weddingStore";
import type { ThemeConfig } from "@/types/wedding";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const TEMPLATE_IDS: ThemeConfig["template"][] = [
  "olive-wax-seal",
  "holymaiden-rose",
  "luxury-gold-black",
  "song-hy-do",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isReservedSlug(slug)) return {};
  const meta = await getWeddingMeta(slug);
  if (!meta) return {};
  return {
    title: `Thiệp cưới ${meta.title || meta.groomName + " & " + meta.brideName}`,
    description: `Trân trọng kính mời quý khách đến dự lễ cưới của ${meta.groomName} & ${meta.brideName}.`,
    openGraph: {
      title: `Thiệp cưới ${meta.title || meta.groomName + " & " + meta.brideName}`,
      description: "Trân trọng kính mời!",
      type: "website",
    },
  };
}

export default async function WeddingSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const { slug } = await params;
  if (isReservedSlug(slug)) {
    notFound();
  }

  const requestedTemplate = (await searchParams).template;
  const validTemplate = TEMPLATE_IDS.includes(
    requestedTemplate as ThemeConfig["template"],
  )
    ? (requestedTemplate as ThemeConfig["template"])
    : undefined;

  const weddingData = await loadWeddingData(validTemplate, slug);
  return <InvitationView data={weddingData} slug={slug} />;
}

