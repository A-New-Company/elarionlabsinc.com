import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

/**
 * Waitlist store with two backends:
 *   • Production (Vercel)  → Upstash Redis, when REST env vars are present.
 *   • Local dev            → file-backed JSON (no setup needed).
 *
 * The API route only depends on `addToWaitlist`; swapping backends here
 * requires no changes elsewhere (doc §9.4).
 */

export interface WaitlistEntry {
  name: string;
  email: string;
  goal?: string;
  position: number;
  createdAt: string;
}

export type AddResult =
  | { status: "created"; position: number }
  | { status: "exists"; position: number };

type AddInput = {
  name: string;
  email: string;
  goal?: string;
  createdAt: string;
};

// Seed offset so positions feel established (doc §9.5 "#1,248 in line").
const SEED = 1247;

// Redis keys
const K_SEQ = "waitlist:seq"; // incrementing counter
const K_EMAILS = "waitlist:emails"; // hash email -> position (dedupe)
const K_ENTRIES = "waitlist:entries"; // list of JSON records (export)

/** Build an Upstash client if REST credentials are configured, else null. */
function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function addViaRedis(redis: Redis, input: AddInput): Promise<AddResult> {
  // Reserve a sequence number, then claim the email atomically. If the email
  // already existed, HSETNX returns 0 and we return its stored position
  // (the reserved sequence number is simply skipped — a harmless gap).
  const seq = await redis.incr(K_SEQ);
  const position = SEED + seq;

  const claimed = await redis.hsetnx(K_EMAILS, input.email, position);
  if (claimed === 0) {
    const existing = await redis.hget<number>(K_EMAILS, input.email);
    return { status: "exists", position: Number(existing) };
  }

  await redis.rpush(K_ENTRIES, JSON.stringify({ ...input, position }));
  return { status: "created", position };
}

// ---- File backend (local dev) ----
const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "waitlist.json");

async function readFileStore(): Promise<WaitlistEntry[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as WaitlistEntry[];
  } catch {
    return [];
  }
}

async function addViaFile(input: AddInput): Promise<AddResult> {
  const entries = await readFileStore();
  const existing = entries.find((e) => e.email === input.email);
  if (existing) return { status: "exists", position: existing.position };

  const position = SEED + entries.length + 1;
  entries.push({ ...input, position });
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(entries, null, 2), "utf8");
  return { status: "created", position };
}

export async function addToWaitlist(input: AddInput): Promise<AddResult> {
  const redis = getRedis();
  return redis ? addViaRedis(redis, input) : addViaFile(input);
}
