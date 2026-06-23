import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaConnectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!prismaConnectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set for Prisma to connect to the database.");
}

const adapter = new PrismaPg({
  connectionString: prismaConnectionString,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

globalForPrisma.prisma = prisma;
