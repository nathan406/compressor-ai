/**
 * Database client — singleton Prisma instance.
 *
 * When DATABASE_URL is set: connects to PostgreSQL via Prisma (production).
 * When DATABASE_URL is missing: falls back to an in-memory mock database
 * seeded with demo accounts, so the entire API works with zero external
 * services. Data does not persist across cold starts — that's fine for
 * a demo / Netlify free-tier deployment.
 */

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Only import Prisma when a real database is available — this avoids
// connection errors on startup when no DATABASE_URL is configured.
let prismaClient: any;

if (hasDatabase) {
  // Dynamic import keeps the build working even without DATABASE_URL
  // because PrismaClient itself is available at build time (prisma generate
  // runs in the build script), but we only instantiate it at runtime when
  // the env var is present.
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = globalThis as unknown as { prisma: any | undefined };
  prismaClient = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient;
  }
} else {
  // In-memory fallback — demo mode, no external database needed
  const { mockPrisma } = require("./mockDb");
  prismaClient = mockPrisma;
  console.warn("[db] No DATABASE_URL found — running in demo mode with in-memory database. Data will not persist across cold starts.");
}

export const prisma = prismaClient;
