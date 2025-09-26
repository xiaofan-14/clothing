import { t } from "../trpc";
import z from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export const authRouter = t.router({
  signup: t.procedure
    .input(
      z.object({
        phone: z.string(),
        name: z.string(),
        password: z.string().min(6),
      }))
    .mutation(async ({ input, ctx }) => {
      console.log(input);

      const { phone, name, password } = input
      const existingUser = await ctx.db.user.findUnique({ where: { phone } });
      if (existingUser) {
        throw new Error("用户已存在");
      }

      // 哈希密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const user = await ctx.db.user.create({
        data: {
          phone,
          password: hashedPassword,
          name,
        },
      });

      // 生成 JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: "7d" });

      return { user, token };
    }),

  signin: t.procedure.input(
    z.object({
      phone: z.string(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const { phone, password } = input

      const user = await ctx.db.user.findUnique({ where: { phone } });
      if (!user) {
        throw new Error("用户不存在");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("密码错误");
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: "7d" });

      return { user, token };
    }),
});
