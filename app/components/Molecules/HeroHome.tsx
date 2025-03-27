"use client";
import classNames from "classnames";
import styles from "./HeroHome.module.scss";
import { Suspense, useEffect, useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll } from "framer-motion";
// import { useMenu } from "@contexts/menuContext";
import { Canvas } from "@react-three/fiber";

// import { TrackerInfo } from "@lib/NavTrackerInfo";
import Button from "@components/atoms/Button";
import { ButtonTypeEnum } from "@components/atoms/Button";
// import textResolver from "@lib/textResolver";
// import simpleTextResolver from "@lib/simpleTextResolver";
// import linkResolver from "@lib/linkResolver";
import HeroAnimation from "@components/atoms/HeroAnimation/HeroAnimation";

import useHardwareAcceleration from "./useHardwareAcceleration";
import { getLocalizedValue } from "@/sanity/lib/utils";

// import { Html, View } from "@react-three/drei";

//@ts-ignore
// import vertexShader from "@components/atoms/HeroAnimation/vertexShader.glsl";
//@ts-ignore
// import fragmentShader from "@components/atoms/HeroAnimation/fragmentShader.glsl";

type HeroProps = {
  className?: string;
  story?: any;
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
};
export const HeroHome = ({
  title,
  subtitle,
  backgroundImage,
  primaryCta,
  locale,
}: HeroProps) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref });
  const isHwaEnabled = useHardwareAcceleration();

  const [activeItem, setActiveItem] = useState(0);
  const [hookedYPosition, setHookedYPosition] = useState(0);
  // const { toggleNavColor } = useMenu();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHookedYPosition(v);
    v > 0.1 && activeItem === 1 && setActiveItem(0);
  });

  // useEffect(() => {
  // (hookedYPosition === 0 || (hookedYPosition > 0 && hookedYPosition < 1)) &&
  // toggleNavColor("transparentBlack");
  // }, [hookedYPosition, toggleNavColor]);

  const [textHover, setTextHover] = useState("");

  useEffect(() => {
    let timeoutId: any;
    if (hookedYPosition === 0) {
      timeoutId = setTimeout(() => {
        setActiveItem(1);
      }, 4000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hookedYPosition]);
  const leadVariant = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        // staggerChildren: 1,
      },
    },
  };

  const infoVariant = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        // staggerChildren: 1,
      },
    },
  };

  const groupVariant = {
    initial: {
      opacity: 1,
      transition: {
        when: "afterChildren",
      },
    },
    animate: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        duration: 0.3,
        delay: 2,
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <section className={classNames(styles.hero)} ref={ref}>
      <div className={styles.container}>
        <m.div
          variants={groupVariant}
          initial="initial"
          animate="animate"
          className={styles.foreground}
        >
          <m.h1 className={classNames(styles.title)}>
            {/* {story?.content?.heroTitle &&
              // @ts-ignore
              Array.from(simpleTextResolver(story?.content?.heroTitle)).map(
                (el, i) => (
                  <m.span
                    style={{ display: "inline-block" }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: i / 2 + 2.4,
                      ease: "easeInOut",
                    }}
                    key={i}
                  >
                    {el}{" "}
                  </m.span>
                )
              )} */}
            {getLocalizedValue(title, locale)}
          </m.h1>
          <m.div className={styles.content} variants={groupVariant}>
            {getLocalizedValue(subtitle, locale)}

            <m.div variants={infoVariant} className={styles.body}>
              {getLocalizedValue(subtitle, locale)}
            </m.div>
            <m.div variants={infoVariant}>
              {primaryCta?.text && (
                <Button
                  title={primaryCta?.text}
                  type={ButtonTypeEnum.TEXT}
                  // link={linkResolver("/services", locale)}
                  id="HeroButton"
                />
              )}
            </m.div>
          </m.div>
        </m.div>

        {/* <div className={styles.heroAnimationWrapper}>
          {isHwaEnabled ? (
            <Canvas className={styles.heroAnimation} flat linear key="canvas">
              <HeroAnimation
                activeItem={activeItem}
                setActiveItem={setActiveItem}
              />
            </Canvas>
          ) : (
            <></>
          )} */}
        {/* </div> */}
        <div className={styles.line} />
      </div>
    </section>
  );
};

export default HeroHome;
