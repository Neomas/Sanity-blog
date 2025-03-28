import React from "react";
import styles from "./UspComponent.module.scss";
import { getLocalizedValue } from "@/sanity/lib/utils";

export interface USPItem {
  icon?: string;
  title?: string;
  description?: string;
  locale?: string;
}

export interface USPComponentProps {
  title?: string;
  uspItems?: USPItem[];
  locale;
}

const USPComponent: React.FC<USPComponentProps> = ({
  title,
  uspItems,
  locale,
}) => {
  return (
    <div className={styles.uspSection}>
      {title && (
        <h2 className={styles.sectionTitle}>
          {getLocalizedValue(title, locale)}
        </h2>
      )}
      <div className={styles.uspGrid}>
        {uspItems?.map((item, index) => (
          <div key={index} className={styles.uspItem}>
            {item.icon && (
              <div className={styles.iconWrapper}>
                <i
                  className={`${styles.icon} ${getLocalizedValue(item.icon, locale)}`}
                ></i>
              </div>
            )}
            {item.title && (
              <h3 className={styles.itemTitle}>
                {getLocalizedValue(item.title, locale)}
              </h3>
            )}
            {item.description && (
              <p className={styles.itemDescription}>
                {getLocalizedValue(item.description, locale)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default USPComponent;
