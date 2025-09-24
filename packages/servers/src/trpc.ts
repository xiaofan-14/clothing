import { initTRPC } from "@trpc/server";
import { PrismaClient } from '@prisma/client';

// 添加上下文
export const createContext = ({ db }: { db: PrismaClient }) => ({ db });

export type Context = {
  db: PrismaClient;
};

export const t = initTRPC.context<Context>().create();
