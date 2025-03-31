import { format } from "date-fns";
import styles from "./CardDate.module.scss";
export default function DateComponent({ dateString }: { dateString: string }) {
  return (
    <time dateTime={dateString} className={styles.date}>
      {format(new Date(dateString), "LLLL	d, yyyy")}
    </time>
  );
}
