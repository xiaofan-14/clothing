import { initTRPC } from "@trpc/server";
import { PrismaClient, type User } from '@prisma/client';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const token = req.cookies?.token as string | undefined;

  let user: User | null = null;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      user = await prisma.user.findUnique({ where: { id: payload.id } });
    } catch (e) {
      console.error("token 无效:", e);
    }
  }

  return { db: prisma, req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
export const t = initTRPC.context<Context>().create();
