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

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
      <h1 className="text-balance text-6xl font-bold leading-tight tracking-tighter lg:pr-8 lg:text-8xl">
        {title || demo.title}
      </h1>
      <h2 className="text-pretty mt-5 text-center text-lg lg:pl-8 lg:text-left">
        <PortableText
          className="prose-lg"
          value={description?.length ? description : demo.description}
        />
      </h2>
    </section>
  );
}

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  locale,
  author,
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
> & { locale: string }) {
  return (
    <article>
      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {getLocalizedValue(title, locale)}
            </Link>
          </h3>

          <div className="mb-4 text-lg md:mb-0">
            <DateComponent dateString={date} />
          </div>
        </div>
        <div>
          {excerpt && (
            <p className="text-pretty mb-4 text-lg leading-relaxed">
              {getLocalizedValue(excerpt, locale)}
            </p>
          )}
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
      </div>
    </article>
  );
}

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
