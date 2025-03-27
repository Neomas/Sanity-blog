import React from "react";
import styles from "./UspComponent.module.scss";

export interface USPItem {
  icon?: string;
  title?: string;
  description?: string;
}

export interface USPComponentProps {
  title?: string;
  uspItems?: USPItem[];
}

const USPComponent: React.FC<USPComponentProps> = ({ title, uspItems }) => {
  return (
    <div className={styles.uspSection}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <div className={styles.uspGrid}>
        {uspItems?.map((item, index) => (
          <div key={index} className={styles.uspItem}>
            {item.icon && (
              <div className={styles.iconWrapper}>
                <i className={`${styles.icon} ${item.icon}`}></i>
              </div>
            )}
            {item.title && <h3 className={styles.itemTitle}>{item.title}</h3>}
            {item.description && (
              <p className={styles.itemDescription}>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default USPComponent;
