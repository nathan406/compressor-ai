/**
 * lib/users.ts
 * ─────────────────────────────────────────────────────────────────
 * Demo user store. In production replace with a real auth system
 * (NextAuth, Clerk, Auth0, etc.).
 */

export type UserRecord = {
  password: string;
  role: "admin" | "demo";
};

export const USERS: Record<string, UserRecord> = {
  "admin@compresor.ai": { password: "admin123", role: "admin" },
  "demo@enterprise.ai":  { password: "demo123",  role: "demo"  },
};
