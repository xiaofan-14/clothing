import { initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { PrismaClient, type User } from '@prisma/client';
import jwt from "jsonwebtoken";

const db = new PrismaClient();

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  // 从 cookie 中取 token
  const token = req.cookies?.token as string | undefined;

  let user: User | null = null;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      // 查询数据库得到用户
      user = await db.user.findUnique({
        where: { id: payload.id }
      });
    } catch (e) {
      console.error("token 解析失败", e);
    }
  }

  return { db, req, res, user };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();
