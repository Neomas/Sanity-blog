import Link from "next/link";
import { Suspense } from "react";

import Avatar from "../avatar";
import CoverImage from "../cover-image";
import DateComponent from "../date";
import MoreStories from "../more-stories";
import Onboarding from "../onboarding";
import PortableText from "@/app/components/atoms/portable-text";

import type { HeroQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery, pageQuery } from "@/sanity/lib/queries";
import { getLocalizedValue } from "@/sanity/lib/utils";
import ContentBlockMapper from "@/app/components/Molecules/ContentBlockMapper";

export default async function Page({ params }: { params: any }) {
  const [settings, page] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({ query: pageQuery, params: params }),
  ]);

  const { locale } = await params;

  return (
    <div>
      <ContentBlockMapper blocks={page?.[0]?.contentBlocks} locale={locale} />

      {/* <Intro title={settings?.title} description={settings?.description} /> */}

      <pre>{JSON.stringify(page?.[0], null, 2)}</pre>
    </div>
  );
}
