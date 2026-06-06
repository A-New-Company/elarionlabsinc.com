import type { Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Container that staggers its children on enter. */
export const stagger = (delay = 0, step = 0.09): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: step, delayChildren: delay },
  },
});

/** Fade + rise + de-blur reveal (doc §6.3 A3). */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

/** Word-level mask reveal for the hero headline (doc §6.3 A1). */
export const wordReveal: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export const viewport = { once: true, amount: 0.25 } as const;
