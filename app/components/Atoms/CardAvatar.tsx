import { Image } from "next-sanity/image";

import type { Author } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import styles from "./CardAvatar.module.scss";
import classNames from "classnames";

interface Props {
  name: string;
  picture: Exclude<Author["picture"], undefined> | null;
  className?: string;
}

export default function Avatar({ name, picture, className }: Props) {
  return (
    <div className={classNames(styles.avatarWrapper, className)}>
      {picture?.asset?._ref ? (
        <div className={styles.imageWrapper}>
          <Image
            alt={picture?.alt || ""}
            className={styles.image}
            height={48}
            width={48}
            src={
              urlForImage(picture)
                ?.height(96)
                .width(96)
                .fit("crop")
                .url() as string
            }
          />
        </div>
      ) : (
        <div>By </div>
      )}
      <div className={styles.name}>{name}</div>
    </div>
  );
}
