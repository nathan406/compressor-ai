import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "./auth";

export type Handler = (req: NextRequest, user: TokenPayload) => Promise<NextResponse>;

function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7) : null;
}

// Protects a route — requires a valid JWT in the Authorization header
export function withAuth(handler: Handler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    if (req.method === "OPTIONS") return new NextResponse(null, { status: 204 });

    const token = extractToken(req);
    if (!token) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
    }

    try {
      const user = verifyToken(token);
      return handler(req, user);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
  };
}

// Admin-only — wraps withAuth and additionally checks role === "admin"
export function withAdmin(handler: Handler) {
  return withAuth(async (req, user) => {
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return handler(req, user);
  });
}

// Helper used in dynamic routes where withAuth cannot be directly applied
export function getUser(req: NextRequest): TokenPayload | null {
  const token = extractToken(req);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
