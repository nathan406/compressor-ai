/**
 * POST /api/auth/login
 * ─────────────────────────────────────────────────────────────────
 * Validates credentials against the demo user store and returns
 * the user's role on success.
 *
 * Body:   { email: string; password: string }
 * 200:    { role: string; email: string }
 * 401:    { error: "Invalid credentials" }
 */

import { NextRequest, NextResponse } from "next/server";
import { USERS } from "@/lib/users";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email    = String(body.email    ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  const user = USERS[email];
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({ role: user.role, email });
}
