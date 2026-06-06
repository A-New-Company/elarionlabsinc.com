"use client";

import { riseIn } from "@/lib/motion";
import { motion } from "framer-motion";
import { Reveal, RevealGroup } from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Scan",
    body: "A quick body scan and a few questions build your baseline — composition, goals, and starting point.",
  },
  {
    n: "02",
    title: "Personalize",
    body: "Elarion designs your nutrition and training, tuned to your biology, schedule, and ambition.",
  },
  {
    n: "03",
    title: "Evolve",
    body: "It learns from every day and recalibrates — so your plan is always one step ahead of you.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" />
              How it works
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-l text-soft" style={{ maxWidth: "16ch" }}>
              From first scan to lasting change — in three steps.
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="steps">
          {STEPS.map((s) => (
            <motion.div className="step glass" key={s.n} variants={riseIn}>
              <span className="step__num">{s.n}</span>
              <h3 className="heading">{s.title}</h3>
              <p>{s.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
