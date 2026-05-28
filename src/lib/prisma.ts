import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma singleton.
 *
 * En desarrollo, Next.js hace hot reload constantemente. Si creamos
 * un PrismaClient nuevo en cada cambio, agotaríamos las conexiones
 * de PostgreSQL muy rápido.
 *
 * Esta técnica guarda el cliente en `globalThis` para reusarlo entre
 * recargas en desarrollo, y crea uno fresco en producción.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}