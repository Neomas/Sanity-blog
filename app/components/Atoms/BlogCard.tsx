import React from "react";
import styles from "./BlogCard.module.scss";
import { getLocalizedValue } from "@/sanity/lib/utils";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import Avatar from "./CardAvatar";
import Link from "next/link";
import DateComponent from "./CardDate";

const BlogCard = ({ item, locale }) => {
  return (
    <div className={styles.card}>
      <Link href={`/posts/${item.slug}`} className={styles.link}></Link>

      <div className={styles.imageWrapper}>
        {item?.coverImage && (
          <Image
            className={styles.image}
            width={200}
            height={200}
            alt={item?.coverImage?.alt || ""}
            src={
              urlForImage(item?.coverImage)
                ?.height(200)
                .width(200)
                
                .url() as string
            }
            sizes="100vw"
          />
        )}

        {item.author && (
          <Avatar
            name={item.author.name}
            picture={item.author.picture}
            className={styles.avatar}
          />
        )}
      </div>
      <div className={styles.textWrapper}>
        {item.title && <h5>{getLocalizedValue(item.title, locale)}</h5>}
        <div className={styles.articleInfo}>
          {item.date && <DateComponent dateString={item.date} />}
        </div>

        {item.excerpt && <p>{getLocalizedValue(item.excerpt, locale)}</p>}
      </div>
    </div>
  );
};

export default BlogCard;
