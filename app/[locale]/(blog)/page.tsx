import Link from "next/link";
import { Suspense } from "react";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "@/app/components/atoms/portable-text";

import type { HeroQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch, fetchActiveReleaseDocuments } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery, pageQuery } from "@/sanity/lib/queries";
import { getLocalizedValue } from "@/sanity/lib/utils";
import ContentBlockMapper from "@/app/components/Molecules/ContentBlockMapper";

export default async function Page({ params }: { params: any }) {
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
      perspective: ["r2cmhXobH", "drafts"],
      params: slugParams,
    }),
  ]);
  const releases = await fetchActiveReleaseDocuments();

  const { locale } = await params;

  return (
    <div className="container mx-auto px-5">
      <pre>{JSON.stringify(releases, null, 2)}</pre>
      <ContentBlockMapper blocks={page?.[0]?.contentBlocks} locale={locale} />
    </div>
  );
}
