"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GOALS, waitlistSchema } from "@/lib/validation";
import { useWaitlist } from "@/components/WaitlistProvider";
import Aurora from "@/components/Aurora";
import { Reveal } from "@/components/Reveal";

export default function Waitlist() {
  const { email: ctxEmail, status, position, error, alreadyJoined, submit } =
    useWaitlist();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [hp, setHp] = useState("");
  const [errs, setErrs] = useState<{ name?: string; email?: string }>({});

  // pick up email prefilled by the hero QuickJoin
  useEffect(() => {
    if (ctxEmail) setEmail(ctxEmail);
  }, [ctxEmail]);

  // fire confetti on success
  useEffect(() => {
    if (status !== "success") return;
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#6EE7F9", "#A78BFA", "#4ADE9E"],
        scalar: 0.9,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [status]);

  const validateStep1 = () => {
    const next: typeof errs = {};
    if (!name.trim()) next.name = "Please enter your name";
    const emailOk = waitlistSchema.shape.email.safeParse(email).success;
    if (!emailOk) next.email = "Enter a valid email";
    setErrs(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({ name, email, goal, hp });
  };

  const success = status === "success";

  return (
    <section className="section cta" id="join">
      <Aurora />
      <div className="container cta__inner">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
            >
              <Reveal>
                <span className="eyebrow">
                  <span className="dot" />
                  Early Access · Limited Spots
                </span>
              </Reveal>
              <h2 className="display-l text-soft" style={{ maxWidth: "16ch" }}>
                Be among the first to evolve.
              </h2>
              <p className="lead measure">
                Join the waitlist and we&apos;ll invite you the moment your
                personal system is ready.
              </p>

              <form className="form" onSubmit={handleSubmit} noValidate>
                {/* honeypot */}
                <input
                  className="form__hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  name="company"
                />

                <AnimatePresence mode="wait" initial={false}>
                  {step === 0 ? (
                    <motion.div
                      key="s1"
                      className="form__step"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className={`field ${errs.name ? "field--error" : ""}`}>
                        <input
                          id="wl-name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          aria-label="Name"
                          aria-invalid={!!errs.name}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        {errs.name && <span className="field__error">{errs.name}</span>}
                      </div>
                      <div className={`field ${errs.email ? "field--error" : ""}`}>
                        <input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="Email address"
                          aria-label="Email"
                          aria-invalid={!!errs.email}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {errs.email && (
                          <span className="field__error">{errs.email}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                        style={{ width: "100%" }}
                      >
                        Continue →
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="s2"
                      className="form__step"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="field">
                        <select
                          aria-label="Main goal"
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                        >
                          {GOALS.map((g) => (
                            <option key={g.value} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form__row">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => setStep(0)}
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={status === "submitting"}
                          style={{ flex: 1 }}
                        >
                          {status === "submitting" ? "Joining…" : "Claim my spot"}
                        </button>
                      </div>
                      {error && (
                        <span className="field__error" role="alert">
                          {error}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="form__note">
                  We&apos;ll only email you about early access. No spam — unsubscribe
                  anytime.
                </p>
                <div className="dots" aria-hidden="true">
                  <span className={step === 0 ? "on" : ""} />
                  <span className={step === 1 ? "on" : ""} />
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="glass success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <svg className="success__check" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" />
                <path d="M20 33l8 8 16-18" />
              </svg>
              <h2 className="display-l text-soft">
                {alreadyJoined ? "You're already in." : "You're in."}
              </h2>
              {position ? (
                <p className="lead">
                  You&apos;re{" "}
                  <span className="success__pos gradient-text">
                    #{position.toLocaleString()}
                  </span>{" "}
                  in line.
                </p>
              ) : null}
              <p className="lead measure">
                Check your inbox ✉️ — we&apos;ll be in touch with your invitation
                soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
