"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Status = "idle" | "submitting" | "success" | "error";

interface WaitlistState {
  email: string;
  setEmail: (v: string) => void;
  status: Status;
  position: number | null;
  error: string | null;
  alreadyJoined: boolean;
  submit: (data: {
    name: string;
    email: string;
    goal?: string;
    hp?: string;
  }) => Promise<boolean>;
}

const Ctx = createContext<WaitlistState | null>(null);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const submit = useCallback<WaitlistState["submit"]>(async (data) => {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPosition(json.position ?? null);
        setAlreadyJoined(false);
        setStatus("success");
        return true;
      }
      if (res.status === 409) {
        setPosition(json.position ?? null);
        setAlreadyJoined(true);
        setStatus("success");
        return true;
      }
      setError(
        json.error === "invalid_email"
          ? "Please enter a valid email."
          : json.error === "rate_limited"
          ? "Too many attempts. Please try again shortly."
          : "Something went wrong. Please try again."
      );
      setStatus("error");
      return false;
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      email,
      setEmail,
      status,
      position,
      error,
      alreadyJoined,
      submit,
    }),
    [email, status, position, error, alreadyJoined, submit]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaitlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWaitlist must be used within WaitlistProvider");
  return ctx;
}
