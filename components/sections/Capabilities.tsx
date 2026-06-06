"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "@/components/Reveal";

const CAPS = [
  {
    key: "scan",
    title: "Visual Body Scan",
    body: "A 30-second scan turns your phone camera into a body-composition lab — tracking changes most scales never see.",
    viz: "ring" as const,
    ringValue: 0.78,
    metric: { num: "12.4%", lbl: "Body fat" },
  },
  {
    key: "nutrition",
    title: "Personalized Nutrition",
    body: "Meals tuned to your goals, schedule, and biology — recalibrated every day from how your body actually responds.",
    viz: "bars" as const,
  },
  {
    key: "training",
    title: "Adaptive Training",
    body: "Every workout adjusts to your recovery, sleep, and momentum. Harder when you're ready, lighter when you're not.",
    viz: "wave" as const,
  },
  {
    key: "support",
    title: "Emotional Support",
    body: "An AI that notices when motivation dips and meets you with the right nudge — encouragement, not guilt.",
    viz: "float" as const,
  },
];

function Ring({ value }: { value: number }) {
  const C = 2 * Math.PI * 80;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div className="cap__viz" ref={ref}>
      <svg className="ring" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6EE7F9" />
            <stop offset="0.5" stopColor="#A78BFA" />
            <stop offset="1" stopColor="#4ADE9E" />
          </linearGradient>
        </defs>
        <circle className="ring__bg" cx="100" cy="100" r="80" />
        <motion.circle
          className="ring__fg"
          cx="100"
          cy="100"
          r="80"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={inView ? { strokeDashoffset: C * (1 - value) } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="cap__metric">
        <div className="num gradient-text">12.4%</div>
        <div className="lbl">Body fat · −2.1 this month</div>
      </div>
    </div>
  );
}

function PanelTag({ children }: { children: string }) {
  return <span className="cap__tag">{children}</span>;
}

function Bars() {
  // heights as a % of the chart area — explicit so bars are never zero-height
  const data = [
    { h: 52, c: "Mon" },
    { h: 74, c: "Tue" },
    { h: 63, c: "Wed" },
    { h: 92, c: "Thu" },
    { h: 70, c: "Fri" },
    { h: 84, c: "Sat" },
    { h: 58, c: "Sun" },
  ];
  return (
    <div className="cap__viz">
      <PanelTag>This week · macros on target</PanelTag>
      <div className="bars">
        {data.map((d, i) => (
          <div className="bar" key={i}>
            <motion.span
              className="bar__fill"
              initial={{ height: 0 }}
              whileInView={{ height: `${d.h}%` }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="bar__lbl">{d.c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Wave() {
  return (
    <div className="cap__viz">
      <PanelTag>Readiness · last 14 days</PanelTag>
      <svg className="wave" viewBox="0 0 320 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6EE7F9" />
            <stop offset="1" stopColor="#4ADE9E" />
          </linearGradient>
          <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(110,231,249,0.28)" />
            <stop offset="1" stopColor="rgba(110,231,249,0)" />
          </linearGradient>
        </defs>
        {/* baseline grid */}
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.06)" />
        ))}
        <motion.path
          className="wave__area"
          d="M0 110 Q 40 50 80 80 T 160 70 T 240 50 T 320 64 L320 160 L0 160 Z"
          fill="url(#waveFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        />
        <motion.path
          className="wave__line"
          d="M0 110 Q 40 50 80 80 T 160 70 T 240 50 T 320 64"
          fill="none"
          stroke="url(#waveStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

function Floaters() {
  const cards = [
    { v: "72", k: "Resting HR", top: "10%", left: "8%" },
    { v: "8h 12m", k: "Sleep · 92", top: "58%", left: "6%" },
    { v: "Great", k: "Mood today", top: "16%", left: "54%" },
    { v: "+18%", k: "Recovery", top: "62%", left: "56%" },
  ];
  return (
    <div className="cap__viz">
      <PanelTag>Listening to your signals</PanelTag>
      <div className="floaters__core" aria-hidden="true" />
      {cards.map((c, i) => (
        <div
          className="floatcard glass"
          key={i}
          style={{ top: c.top, left: c.left, animationDelay: `${i * 0.6}s` }}
        >
          <span className="v gradient-text">{c.v}</span>
          <span className="k">{c.k}</span>
        </div>
      ))}
    </div>
  );
}

function Viz({ cap }: { cap: (typeof CAPS)[number] }) {
  if (cap.viz === "ring") return <Ring value={cap.ringValue!} />;
  if (cap.viz === "bars") return <Bars />;
  if (cap.viz === "wave") return <Wave />;
  return <Floaters />;
}

export default function Capabilities() {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    panelRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section" id="capabilities">
      <div className="container">
        <div className="cap__grid">
          <div className="cap__left">
            <span className="eyebrow">
              <span className="dot" />
              Capabilities
            </span>
            <h2 className="display-l text-soft" style={{ marginTop: "1.25rem", maxWidth: "14ch" }}>
              One system. Every dimension of you.
            </h2>

            <div className="cap__steps">
              {CAPS.map((c, i) => (
                <div
                  key={c.key}
                  className={`cap__step ${active === i ? "cap__step--active" : ""}`}
                >
                  <div>
                    <h4>{c.title}</h4>
                    <p>{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cap__right">
            {CAPS.map((c, i) => (
              <Reveal key={c.key}>
                <div
                  className="cap__panel glass"
                  data-idx={i}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                >
                  <Viz cap={c} />
                </div>
                {/* mobile-only inline copy (steps list is hidden on small screens) */}
                <div className="cap__mobile-copy">
                  <h4 className="heading" style={{ marginTop: "1.25rem" }}>
                    {c.title}
                  </h4>
                  <p className="lead">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
