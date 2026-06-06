"use client";

import { motion } from "framer-motion";
import { riseIn } from "@/lib/motion";
import Counter from "@/components/Counter";
import { Reveal, RevealGroup } from "@/components/Reveal";

const METRICS = [
  { to: 94, suffix: "%", lbl: "12-week adherence" },
  { to: 2.3, suffix: "×", decimals: 1, lbl: "Faster visible results" },
  { to: 12000, suffix: "+", lbl: "On the waitlist" },
  { to: 4.9, suffix: "/5", decimals: 1, lbl: "Beta satisfaction" },
];

const QUOTES = [
  {
    text: "It's the first thing that actually adjusted when life got in the way. It felt less like an app and more like someone in my corner.",
    name: "Maya R.",
    role: "Marathoner",
  },
  {
    text: "The body scan caught changes my scale never showed. Seeing real progress kept me going past the plateau.",
    name: "Daniel K.",
    role: "Beta member",
  },
  {
    text: "I've tried every tracker. This is the only one that felt like it understood me, not just my numbers.",
    name: "Sofia L.",
    role: "Strength coach",
  },
];

export default function SocialProof() {
  return (
    <section className="section">
      <div className="container">
        <RevealGroup className="metrics">
          {METRICS.map((m, i) => (
            <motion.div className="metric" key={i} variants={riseIn}>
              <div className="metric__num gradient-text">
                <Counter to={m.to} suffix={m.suffix} decimals={m.decimals ?? 0} />
              </div>
              <div className="metric__lbl">{m.lbl}</div>
            </motion.div>
          ))}
        </RevealGroup>

        <div className="section-head center" style={{ marginBottom: "clamp(40px,6vw,64px)" }}>
          <Reveal>
            <h2 className="display-l text-soft" style={{ maxWidth: "18ch" }}>
              People don&apos;t just use it. They trust it.
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="quotes">
          {QUOTES.map((q, i) => (
            <motion.figure className="quote glass" key={i} variants={riseIn}>
              <p>&ldquo;{q.text}&rdquo;</p>
              <figcaption className="quote__author">
                <div className="quote__avatar" />
                <div>
                  <div className="quote__name">{q.name}</div>
                  <div className="quote__role">{q.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
