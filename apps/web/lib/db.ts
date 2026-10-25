import { PrismaClient, PrismaPg } from "database";

interface IPrismaGlobal {
  cachedPrisma?: PrismaClient;
}

const prismaGlobal = globalThis as unknown as IPrismaGlobal;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL ?? "";
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const db = prismaGlobal.cachedPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.cachedPrisma = db;
}
