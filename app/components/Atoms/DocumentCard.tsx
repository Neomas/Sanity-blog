import React from "react";
import styles from "./BlogCard.module.scss";
import { getLocalizedValue, resolveFileUrl } from "@/sanity/lib/utils";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import Avatar from "./CardAvatar";
import Link from "next/link";
import DateComponent from "./CardDate";

const DocumentCard = ({ item, locale }) => {
  return (
    <div className={styles.card}>
      {resolveFileUrl(item.file) && (
        <Link
          download={true}
          href={resolveFileUrl(item?.file) || ""}
          className={styles.link}
          target="_blank"
        ></Link>
      )}

      <div className={styles.textWrapper}>
        {item.name && <h5>{item.name}</h5>}
        {/* <p>{JSON.stringify(item.file)} </p>
         */}
        {/* <p>{resolveFileUrl(item.file)} </p> */}
      </div>
    </div>
  );
};

export default DocumentCard;
