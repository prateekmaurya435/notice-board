import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance across hot reloads in development
// so we don't open a new DB connection pool on every file change.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
