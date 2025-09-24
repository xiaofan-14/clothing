import { t } from "../trpc";
import { signin, signup, signout } from "../services/auth";
import z from "zod";

export const authRouter = t.router({
  signup: t.procedure.input(
    z.object({
      phone: z.string(),
      name: z.string(),
      password: z.string().min(6),
    })
  ).mutation(async ({ input }) => {
    const { phone, name, password } = input
    signup(phone, password, name)
  }),

  signin: t.procedure.input(
    z.object({
      phone: z.string(),
      password: z.string().min(6),
    })
  ).mutation(({ input }) => {
    const { phone, password } = input

    signin(phone, password )
  }),

  // signout: t.procedure.mutation(() => signout()),
});
