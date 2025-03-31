import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery, pageQuery } from "@/sanity/lib/queries";
import ContentBlockMapper from "@/app/components/Molecules/ContentBlockMapper";
import { cookies, draftMode } from "next/headers";

export const dynamic = "force-dynamic"; // Enables dynamic rendering
export const revalidate = 0; // Disable static caching

export default async function Page({ params }: { params: any }) {
  // Read perspective from cookies set by Presentation Tool
  const cookiesData = await cookies();
  const { isEnabled: isDraftMode } = await draftMode();

  const perspective =
    cookiesData.get("sanity-preview-perspective")?.value?.split(",") ||
    isDraftMode
      ? "draft"
      : "published";

  const [settings, page] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({
      query: pageQuery,
      perspective: perspective,
      params,
      stega: true,
    }),
  ]);

  const { locale } = await params;

  return (
    <div>
      <ContentBlockMapper blocks={page?.[0]?.contentBlocks} locale={locale} />
    </div>
  );
}
