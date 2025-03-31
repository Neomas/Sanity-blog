import React from "react";
import styles from "./Hero.module.scss";
import { PortableText } from "@portabletext/react";
import { getLocalizedValue } from "@/sanity/lib/utils";
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
    <div
      className={styles.hero}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage.url})`
          : "none",
      }}
    >
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
            {primaryCta.text}
          </a>
        )}
      </div>
    </div>
  );
};

export default HeroComponent;
