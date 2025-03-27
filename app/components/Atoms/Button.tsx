import styles from "./Button.module.scss";
import classNames from "classnames";
// import { Icon, IconsEnum } from "./Icon";
import Link from "next/link";
// import { Link } from "@madeinhaus/nextjs-page-transition";

export enum ButtonTypeEnum {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",
  TEXT = "text",
  FULLCOLOR = "fullcolor",
}

export interface IButton {
  title: string;
  type?: ButtonTypeEnum;
  // icon?: IconsEnum;
  iconPosition?: "start" | "end";
  onClick?: () => void;
  className?: string;
  link?: string;
  disabled?: boolean;
  darkmode?: boolean;
  arialabel?: string | undefined;
  target?: string;
  accentColor?: "purple" | "yellow" | "pink";
  id?: string;
}

const LongArrow = () => {
  return (
    <span className={styles.arrow}>
      <svg
        width="40"
        height="12"
        viewBox="0 0 40 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M38.2358 6.4L31.9633 11.388L32.5 12L40 5.9832L32.5 0L31.9625 0.6112L38.2367 5.6H0V6.4H38.2358Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
};

export const Button = ({
  // icon,
  type = ButtonTypeEnum.TERTIARY,
  className,
  link,
  title,
  iconPosition = "end",
  accentColor,
  darkmode = false,
  target,
  arialabel,
  disabled,
  id,
  ...props
}: IButton) => {
  // const buttonIcon = type === ButtonTypeEnum.TEXT ? IconsEnum.ARROWRIGHT : icon;

  const buttonClass = classNames(
    "button",
    styles.button,
    type && styles[`button__${type}`],
    className,
    accentColor && styles[accentColor],
    darkmode && styles.darkmode,
    styles.arrowRight
  );

  return link ? (
    <Link
      href={link}
      passHref
      className={buttonClass}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : ""}
      aria-label={arialabel ? arialabel : title}
      {...props}
      id={id}
    >
      {title && <span>{title}</span>}

      <span className={classNames(styles.icon, "icon")}>
        <span className={styles.arrowwrapper}>
          <LongArrow />
        </span>
      </span>
    </Link>
  ) : (
    <button
      className={buttonClass}
      {...props}
      aria-label={arialabel ? arialabel : title}
      disabled={disabled}
      id={id}
    >
      {title && <span>{title}</span>}

      <span className={classNames(styles.icon, "icon")}>
        <span className={styles.arrowwrapper}>
          <LongArrow />
        </span>
      </span>
    </button>
  );
};

export default Button;
