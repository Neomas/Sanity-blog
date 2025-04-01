import React from "react";
import styles from "./BlogGrid.module.scss";
import { getLocalizedValue } from "@/sanity/lib/utils";
import PortableText from "@components/Atoms/PortableText";
import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";

// import Avatar from "@components/atoms/CardAvatar";
// import CoverImage from "@components/atoms/cover-image";
// import DateComponent from "@components/atoms/CardDate";
import BlogCard from "@components/Atoms/BlogCard";

export interface BlogGridProps {
  title?: string;
  info?: any;
  locale;
}
const BlogGrid = async ({ title, info, locale }) => {
  const params = { limit: 2, skip: 0 };
  const data = await sanityFetch({ query: moreStoriesQuery, params });

  return (
    <section className={styles.section}>
      <div className={styles.textWrapper}>
        {title && (
          <h2 className={styles.title}>{getLocalizedValue(title, locale)}</h2>
        )}
        {info && (
          <PortableText
            className={styles.info}
            value={getLocalizedValue(info, locale)}
          />
        )}
      </div>

      <div className={styles.blogGrid}>
        {data?.map((post) => {
          const { _id } = post;
          return (
            <BlogCard item={post} locale={locale} key={_id} />
            // <article key={_id}>
            //   <Link href={`/posts/${slug}`} className="group mb-5 block">
            //     <CoverImage image={coverImage} priority={false} />
            //   </Link>
            //   <h3 className="text-balance mb-3 text-3xl leading-snug">
            //     <Link href={`/posts/${slug}`} className="hover:underline">
            //       {getLocalizedValue(title, locale)}
            //     </Link>
            //   </h3>
            //   <div className="mb-4 text-lg">
            //     <DateComponent dateString={post.date} />
            //   </div>
            //   {excerpt && (
            //     <p className="text-pretty mb-4 text-lg leading-relaxed">
            //       {getLocalizedValue(excerpt, locale)}
            //     </p>
            //   )}
            //   {author && <Avatar name={author.name} picture={author.picture} />}
            // </article>
          );
        })}
      </div>
    </section>
  );
};

export default BlogGrid;
