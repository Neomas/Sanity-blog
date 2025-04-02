import React from "react";
import styles from "./DocumentsBlock.module.scss";
import { getLocalizedValue } from "@/sanity/lib/utils";
import PortableText from "@components/Atoms/PortableText";

import { sanityFetch } from "@/sanity/lib/fetch";
import { documentQuery } from "@/sanity/lib/queries";
import DocumentCard from "@components/Atoms/DocumentCard";

export interface DocumentsBlockProps {
  title?: string;
  info?: any;
  locale;
}
const DocumentsBlock = async ({ title, info, locale }: DocumentsBlockProps) => {
  const params = { limit: 2, skip: 0 };
  const data = await sanityFetch({ query: documentQuery, params });

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
          return <DocumentCard item={post} locale={locale} key={_id} />;
        })}
      </div>
    </section>
  );
};

export default DocumentsBlock;
