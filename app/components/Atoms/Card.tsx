import Image from "next/image";
import React from "react";
import styles from "./Card.module.scss";
import { urlForImage } from "@/sanity/lib/utils";
import PortableText from "@/app/components/atoms/portable-text";

import { getLocalizedValue } from "@/sanity/lib/utils";

const Card = ({ item, locale }: { item?: any; locale?: string }) => {
  const { title, image, info } = item;

  return (
    <div className={styles.card}>
      {urlForImage(image)?.url() && (
        <Image
          src={urlForImage(image)?.url() as string}
          alt={title || "Image"}
          width={200}
          height={386}
        />
      )}
      <h4>{title}</h4>
      <pre>{JSON.stringify(info)}</pre>
      <PortableText className="mx-auto max-w-2xl" value={info} />
    </div>
  );
};

export default Card;
