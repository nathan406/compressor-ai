/**
 * POST /api/auth/register
 * Creates a new user. Pass adminSecret matching REGISTER_SECRET env var to create admin.
 * Body:   { email, password, company?, adminSecret? }
 * 201:    { token, role, email, userId }
 * 400/409: { error }
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  try {
    const body     = await req.json().catch(() => ({}));
    const email    = String(body.email    ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const company  = String(body.company  ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const isAdmin = body.adminSecret &&
      process.env.REGISTER_SECRET &&
      body.adminSecret === process.env.REGISTER_SECRET;

    const hashed = await hashPassword(password);
    const user   = await prisma.user.create({
      data: { email, password: hashed, role: isAdmin ? "admin" : "demo", company },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ token, role: user.role, email: user.email, userId: user.id }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
