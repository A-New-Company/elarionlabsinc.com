import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

/**
 * Waitlist store with pluggable backends, chosen automatically by which
 * environment variables are present:
 *
 *   1. Google Sheet  → when SHEETS_WEBHOOK_URL is set (Apps Script web app).
 *   2. Upstash Redis → when KV/UPSTASH REST env vars are set.
 *   3. File (dev)    → otherwise, writes .data/waitlist.json locally.
 *
 * The API route only depends on `addToWaitlist` — swapping backends here
 * needs no changes elsewhere (doc §9.4).
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

// ── Backend 1: Google Sheet (via Apps Script web app) ───────────────────
async function addViaSheets(input: AddInput): Promise<AddResult> {
  const url = process.env.SHEETS_WEBHOOK_URL as string;
  const secret = process.env.SHEETS_WEBHOOK_SECRET || "";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, secret }),
    // Apps Script 302-redirects to googleusercontent.com; fetch follows it.
    redirect: "follow",
  });

  const text = await res.text();
  let data: { status?: string; position?: number; error?: string };
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("sheets_bad_response");
  }

  if (data.status === "exists") {
    return { status: "exists", position: Number(data.position) };
  }
  if (data.status === "created") {
    return { status: "created", position: Number(data.position) };
  }
  throw new Error(data.error || "sheets_error");
}

// ── Backend 2: Upstash Redis ────────────────────────────────────────────
const K_SEQ = "waitlist:seq";
const K_EMAILS = "waitlist:emails";
const K_ENTRIES = "waitlist:entries";

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function addViaRedis(redis: Redis, input: AddInput): Promise<AddResult> {
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

// ── Backend 3: File (local dev) ─────────────────────────────────────────
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
  if (process.env.SHEETS_WEBHOOK_URL) return addViaSheets(input);
  const redis = getRedis();
  if (redis) return addViaRedis(redis, input);
  return addViaFile(input);
}
