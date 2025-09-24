import { t } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { productRouter } from './product'

export const appRouter = t.router({
  auth: authRouter,
  category: categoryRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
