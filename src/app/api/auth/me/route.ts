/**
 * GET /api/auth/me
 * Returns the current user's profile. Frontend calls this on load to validate the stored token.
 * Headers: Authorization: Bearer <token>
 * 200: { id, email, role, company, createdAt }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where:  { id: user.userId },
    select: { id: true, email: true, role: true, company: true, createdAt: true },
  });

  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(dbUser);
}
