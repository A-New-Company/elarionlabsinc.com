"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { riseIn } from "@/lib/motion";
import { Reveal, RevealGroup } from "@/components/Reveal";

const PILLARS = [
  {
    title: "Coach",
    body: "Form-aware guidance that reads your body and adapts every session — like a trainer watching your every rep.",
    icon: (
      <path d="M4 18V8m5 10V5m5 13v-7m5 7V9" strokeWidth="2" strokeLinecap="round" />
    ),
  },
  {
    title: "Cheer",
    body: "Emotional intelligence that knows when to push and when to rest, keeping you motivated through every plateau.",
    icon: (
      <path
        d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Evolve",
    body: "A system that compounds. Every scan, meal, and workout sharpens a model of you that gets smarter over time.",
    icon: (
      <path
        d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

function TiltCard({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  return (
    <motion.div
      className="pillar glass"
      variants={riseIn}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onPointerMove={(e) => {
        if (window.matchMedia("(hover: none)").matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Promise() {
  return (
    <section className="section" id="vision">
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" />
              The Promise
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-l text-soft" style={{ maxWidth: "20ch" }}>
              It doesn&apos;t just track you. It understands you.
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="pillars">
          {PILLARS.map((p) => (
            <TiltCard key={p.title}>
              <div className="pillar__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {p.icon}
                </svg>
              </div>
              <h3 className="heading">{p.title}</h3>
              <p>{p.body}</p>
            </TiltCard>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
