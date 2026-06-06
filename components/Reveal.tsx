"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { riseIn, stagger, viewport } from "@/lib/motion";

/** Wraps children and reveals them on scroll into view (doc §7.4). */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
  className?: string;
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={riseIn}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

/** Staggered group — children should use the `riseIn` variant. */
export function RevealGroup({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger(delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}
