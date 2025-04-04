import React from "react";
import styles from "./Hero.module.scss";
import { PortableText } from "@portabletext/react";
import { getLocalizedValue, urlForImage } from "@/sanity/lib/utils";
import { Image } from "next-sanity/image";
export interface HeroComponentProps {
  title?: any;
  subtitle?: any;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  primaryCta?: {
    text?: string;
    link?: string;
  };
  locale?: string;
}

const HeroComponent: React.FC<HeroComponentProps> = ({
  title,
  subtitle,
  backgroundImage,
  primaryCta,
  locale,
}) => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        {getLocalizedValue(title) && (
          <h1 className={styles.title}>{getLocalizedValue(title, locale)}</h1>
        )}
        {subtitle && (
          <p className={styles.subtitle}>
            {getLocalizedValue(subtitle, locale)}
          </p>
        )}
        {primaryCta && primaryCta.text && (
          <a href={primaryCta.link || "#"} className={styles.ctaButton}>
            {getLocalizedValue(primaryCta.text, locale)}
          </a>
        )}
      </div>

      {urlForImage(backgroundImage) && (
        <div className={styles.heroImage}>
          <Image
            src={
              (urlForImage(backgroundImage) &&
                urlForImage(backgroundImage)?.toString()) ||
              ""
            }
            alt={getLocalizedValue(subtitle, locale) || ""}
            width={1200}
            height={800}
            className={styles.image}
            priority
          />
        </div>
      )}
    </div>
  );
};

export default HeroComponent;
