import { NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/validation";
import { addToWaitlist } from "@/lib/store";

export const runtime = "nodejs";

// Simple in-memory rate limit (per warm instance). Replace with Upstash/Redis
// for production multi-instance deployments (doc §9.3).
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW = 60_000;
const MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (limited(ip)) {
    return NextResponse.json(
      { success: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid_request" },
      { status: 400 }
    );
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const error = issue?.path[0] === "email" ? "invalid_email" : "invalid_request";
    return NextResponse.json({ success: false, error }, { status: 422 });
  }

  // Honeypot triggered → pretend success, store nothing (doc §9.3).
  if (parsed.data.hp) {
    return NextResponse.json({ success: true, position: 0 });
  }

  const { name, email, goal } = parsed.data;

  try {
    const result = await addToWaitlist({
      name,
      email,
      goal: goal || undefined,
      createdAt: new Date().toISOString(),
    });

    // TODO(prod): trigger Resend welcome email here (doc §9.6).

    if (result.status === "exists") {
      return NextResponse.json(
        { success: false, error: "already_registered", position: result.position },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: true, position: result.position });
  } catch {
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    );
  }
}
