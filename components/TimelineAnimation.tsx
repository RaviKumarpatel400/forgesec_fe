"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import type { ReactNode, RefObject } from "react";

type TimelineAnimationProps = {
  animationNum: number;
  children: ReactNode;
  className?: string;
  timelineRef: RefObject<HTMLElement | null>;
};

export default function TimelineAnimation({
  animationNum,
  children,
  className,
  timelineRef
}: TimelineAnimationProps) {
  const isInView = useInView(timelineRef, { once: true, amount: 0.25 });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={isInView ? "visible" : "hidden"}
      className={className}
      custom={animationNum}
      initial="hidden"
      variants={{
        hidden: reducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 18, filter: "blur(14px)" },
        visible: (step: number) => ({
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            delay: reducedMotion ? 0 : step * 0.11,
            duration: reducedMotion ? 0 : 0.62,
            ease: [0.22, 1, 0.36, 1]
          }
        })
      }}
    >
      {children}
    </motion.div>
  );
}
