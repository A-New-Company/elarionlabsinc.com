"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/Reveal";

export default function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // parallax layers (doc §5 · 05)
  const yDevice = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yCardA = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const yCardB = useTransform(scrollYProgress, [0, 1], [-40, 100]);

  return (
    <section className="section showcase" ref={ref}>
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" />
              The Experience
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-l text-soft" style={{ maxWidth: "18ch" }}>
              Your whole health, in one calm surface.
            </h2>
          </Reveal>
        </div>

        <div className="showcase__stage">
          <motion.div
            className="floatcard glass"
            style={{ y: yCardA, position: "absolute", top: "12%", left: "12%" }}
          >
            <span className="v gradient-text">412</span>
            <span className="k">Calories · today</span>
          </motion.div>

          <motion.div
            className="floatcard glass"
            style={{ y: yCardB, position: "absolute", bottom: "14%", right: "12%" }}
          >
            <span className="v gradient-text">8h 12m</span>
            <span className="k">Sleep · 92 score</span>
          </motion.div>

          <motion.div className="device" style={{ y: yDevice }}>
            <div className="device__screen">
              <div className="device__row">
                <span>Today</span>
                <span className="gradient-text">Elarion</span>
              </div>
              <svg className="device__ring" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="devGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6EE7F9" />
                    <stop offset="1" stopColor="#4ADE9E" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="url(#devGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 80}
                  initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                  whileInView={{ strokeDashoffset: 2 * Math.PI * 80 * 0.26 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="device__row">
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  Daily readiness
                </span>
                <span className="gradient-text" style={{ fontWeight: 600 }}>
                  74%
                </span>
              </div>
              <div className="device__row">
                <span>Next: Lower body · 38 min</span>
              </div>
              <div
                style={{
                  marginTop: "auto",
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                }}
              >
                Recalibrated 2 min ago
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
