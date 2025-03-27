import ContentBlockMapper from "@components/Molecules/ContentBlockMapper";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { getLocalizedValue } from "@/sanity/lib/utils";
import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string; locale?: string }>;
};

const pageSlugs = defineQuery(
  `*[_type == "pages" && defined(slug.current)]{"slug": slug.current}`
);

export async function generateStaticParams() {
  return await sanityFetch({
    query: pageSlugs,
    perspective: "published",
    stega: true,
  });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await sanityFetch({
    query: pageQuery,
    params,
    stega: true,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const { locale } = await params;
  //   const ogImage = resolveOpenGraphImage(post?.coverImage);
  const title = post?.title && post?.title[locale];
  return {
    title: getLocalizedValue(title, locale),
    // description: post?.excerpt?.en,
    // openGraph: {
    //   images: ogImage ? [ogImage, ...previousImages] : previousImages,
    // },
  } satisfies Metadata;
}

export default async function Page({ params }: { params: any }) {
  const [page] = await Promise.all([sanityFetch({ query: pageQuery, params })]);
  const { locale } = await params;

  //   if (!post?._id) {
  //     return notFound();
  //   }

  return (
    <div>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <ContentBlockMapper blocks={page?.contentBlocks} locale={locale} />
    </div>
  );
}
