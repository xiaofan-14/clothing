import { t } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { productRouter } from './product';
import { cartRouter } from './cart';

export const appRouter = t.router({
  auth: authRouter,
  category: categoryRouter,
  product: productRouter,
  cart: cartRouter
});

export type AppRouter = typeof appRouter;
