import React from "react";
import styles from "./Form.module.scss";
import { getLocalizedValue } from "@/sanity/lib/utils";
import PortableText from "@components/Atoms/PortableText";

export interface FormProps {
  title?: string;
  info?: any;
  fields?: any;
  locale;
}

const Form = ({ title, info, fields, locale }: FormProps) => {
  return (
    <section className={styles.section}>
      {" "}
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
      <pre>{JSON.stringify(fields, null, 2)}</pre>
    </section>
  );
};

export default Form;
