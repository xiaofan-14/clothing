import { initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  return { db, req, res };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();
