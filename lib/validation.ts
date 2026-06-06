import { z } from "zod";

export const GOALS = [
  { value: "", label: "What's your main goal? (optional)" },
  { value: "fatloss", label: "Lose fat" },
  { value: "muscle", label: "Build muscle" },
  { value: "endurance", label: "Improve endurance" },
  { value: "health", label: "General health" },
] as const;

export const waitlistSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  goal: z.enum(["", "fatloss", "muscle", "endurance", "health"]).optional(),
  // honeypot — accept any value here so the handler can silently absorb bots
  // (a non-empty value means "bot"); validating it away would leak the trap.
  hp: z.string().optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
