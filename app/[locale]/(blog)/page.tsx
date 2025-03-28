import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import type { HeroQueryResult } from "@/sanity.types";
import { sanityFetch, fetchActiveReleaseDocuments } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery, pageQuery } from "@/sanity/lib/queries";
import ContentBlockMapper from "@/app/components/Molecules/ContentBlockMapper";

export const dynamic = "force-dynamic"; // Enables dynamic rendering
export const revalidate = 0; // Disable static caching

export default async function Page({ params }: { params: any }) {
  // Read perspective from cookies set by Presentation Tool
  const cookiesData = await cookies();
  const perspective =
    cookiesData.get("sanity-preview-perspective")?.value?.split(",") ||
    "published";

  const slugParams = {
    ...params,
    slug: "home",
    useCdn: false,
  };

  const [settings, page] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({
      query: pageQuery,
      perspective: perspective,
      params: slugParams,
      stega: true,
    }),
  ]);
  const { locale } = await params;

  return (
    <div className="container mx-auto px-5">
      <ContentBlockMapper blocks={page?.[0]?.contentBlocks} locale={locale} />
    </div>
  );
}
