"use client";

import { useState } from "react";
import { useWaitlist } from "@/components/WaitlistProvider";

/** Hero inline email capture — prefills the main form and scrolls to it. */
export default function QuickJoin() {
  const { setEmail } = useWaitlist();
  const [value, setValue] = useState("");

  const go = () => {
    setEmail(value);
    const el = document.querySelector("#join");
    el?.scrollIntoView({ behavior: "smooth" });
    // focus the name field after scroll settles
    setTimeout(() => {
      document.getElementById("wl-name")?.focus();
    }, 700);
  };

  return (
    <form
      className="glass hero__quick"
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
    >
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="Enter your email to begin"
        aria-label="Email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary" aria-label="Continue">
        Join →
      </button>
    </form>
  );
}
