"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Top 2px gradient progress line (doc §7.2). */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });
  return <motion.div className="progress-bar" style={{ scaleX, width: "100%" }} />;
}
