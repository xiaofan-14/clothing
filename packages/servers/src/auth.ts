import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET

// 注册
export async function signup(phone: string, password: string, name: string) {
  // 检查用户是否存在
  const existingUser = await prisma.user.findUnique({ where: { phone } });
  if (existingUser) {
    throw new Error("用户已存在");
  }

  // 哈希密码
  const hashedPassword = await bcrypt.hash(password, 10);

  // 创建用户
  const user = await prisma.user.create({
    data: {
      phone,
      password: hashedPassword,
      name,
    },
  });

  // 生成 JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: "7d" });

  return { user, token };
}

// 登录
export async function signin(phone: string, password: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new Error("用户不存在");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("密码错误");
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: "7d" });

  return { user, token };
}

// 登出（前端删除 token 即可，这里可以做黑名单机制）
export async function signout(token: string) {
  // 简单版本：前端丢弃 token
  // 复杂版本：保存到 redis 黑名单，直到 token 过期
  return { message: "已登出" };
}

// 验证 token 中间件
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET!) as unknown as { userId: string };
  } catch {
    throw new Error("无效 token");
  }
}
