"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import Aurora from "@/components/Aurora";
import QuickJoin from "@/components/QuickJoin";

const Particles = dynamic(() => import("@/components/Particles"), { ssr: false });

// Shared reveal so every hero element appears the same way: a smooth
// opacity + rise fade-in (consistent with the subtitle).
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: EASE },
  }),
};

export default function Hero() {
  return (
    <section className="hero" id="top">
      <Aurora />
      <Particles />

      <div className="container hero__inner">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="eyebrow">
            <span className="dot" />
            AI-Powered Health System
          </span>
        </motion.div>

        <motion.h1
          className="display-xl hero__title text-soft"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.15}
        >
          Unlock your <span className="gradient-text">fullest self</span>
          <br />
          with an AI that evolves with you.
        </motion.h1>

        <motion.p
          className="lead hero__sub"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.3}
        >
          Not just another tracker. A personal intelligence that scans your body,
          tunes your nutrition, adapts every workout, and grows with you — like a
          coach who never stops paying attention.
        </motion.p>

        <motion.div
          className="hero__actions"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.45}
        >
          <a href="#join" className="btn btn-primary">
            Get Early Access
          </a>
          <a href="#capabilities" className="btn btn-ghost">
            Explore the system
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.6}
          style={{ width: "min(440px, 100%)" }}
        >
          <QuickJoin />
        </motion.div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-hint__track" />
        Scroll
      </div>
    </section>
  );
}
