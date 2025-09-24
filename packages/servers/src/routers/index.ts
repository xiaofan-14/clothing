import { t } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { productRouter } from './product';
import { cartRouter } from './cart';
import { orderRouter } from './order'
import { favoriteRouter } from './favorite'

export const appRouter = t.router({
  auth: authRouter,
  category: categoryRouter,
  product: productRouter,
  cart: cartRouter,
  order: orderRouter,
  favorite: favoriteRouter
});

export type AppRouter = typeof appRouter;
