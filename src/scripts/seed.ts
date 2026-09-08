/**
 * Database seed script — creates the two demo accounts.
 * Run once after `npm run db:push`:
 *   npm run db:seed
 *
 * Accounts created:
 *   admin@compressor.ai / admin123  (role: admin)
 *   demo@enterprise.ai  / demo123   (role: demo)
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    { email: "admin@compressor.ai", password: "admin123", role: "admin", company: "Compressor AI" },
    { email: "demo@enterprise.ai",  password: "demo123",  role: "demo",  company: "Enterprise Demo Corp" },
  ];

  for (const acc of accounts) {
    const existing = await prisma.user.findUnique({ where: { email: acc.email } });
    if (existing) {
      console.log(`✓ Already exists: ${acc.email}`);
      continue;
    }

    const hashed = await bcrypt.hash(acc.password, 12);
    await prisma.user.create({
      data: {
        email:    acc.email,
        password: hashed,
        role:     acc.role,
        company:  acc.company,
      },
    });
    console.log(`✓ Created: ${acc.email} (${acc.role})`);
  }

  console.log("\nSeed complete. You can now log in with:");
  console.log("  Admin:  admin@compressor.ai / admin123");
  console.log("  Demo:   demo@enterprise.ai  / demo123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
