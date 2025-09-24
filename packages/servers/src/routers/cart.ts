import { t } from "../trpc";
import { z } from 'zod';

export const cartRouter = t.router({
  /* 1. 获取当前用户购物车（含商品快照） */
  get: t.procedure
    .input(z.object({
      userId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      let cart = await ctx.db.cart.findUnique({
        where: { userId: input.userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true
                }
              },
            },   // 一次性带出商品
          },
        },
      });

      /* 用户第一次使用，自动创建空购物车 */
      if (!cart) {
        cart = await ctx.db.cart.create({
          data: { userId: input.userId },
          include: { items: { include: { product: true } } },
        });
      }
      return cart;
    }),

  /* 2. 加入商品 / 更新数量（幂等：存在就累加，不存在就新增） */
  addItem: t.procedure
    .input(z.object({
      userId: z.string(),
      productId: z.string(),
      quantity: z.number().int().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // 没有就创建
      const cart = await ctx.db.cart.upsert({
        where: { userId: input.userId },
        update: {},
        create: { userId: input.userId },
      });

      /* 查看是否已有同款 */
      const existing = await ctx.db.cartItem.findFirst({
        where: { cartId: cart.id, productId: input.productId },
      });

      if (existing) {
        /* 累加数量 */
        return ctx.db.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + input.quantity },
          include: { product: true },
        });
      } else {
        /* 新增一行 */
        return ctx.db.cartItem.create({
          data: {
            cartId: cart.id,
            productId: input.productId,
            quantity: input.quantity,
          },
          include: { product: true },
        });
      }
    }),

  /* 3. 修改数量（0 表示删除，前端可先调用 setQuantity(0) 再调 removeItem） */
  setQuantity: t.procedure
    .input(z.object({
      userId: z.string(),
      itemId: z.string(),
      quantity: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      /* 0 件直接删 */
      if (input.quantity === 0) {
        return ctx.db.cartItem.deleteMany({
          where: { id: input.itemId, cart: { userId: input.userId } },
        });
      }

      /* 否则更新 */
      return ctx.db.cartItem.updateMany({
        where: { id: input.itemId, cart: { userId: input.userId } },
        data: { quantity: input.quantity },
      });
    }),

  /* 4. 删除单项 */
  removeItem: t.procedure
    .input(z.object({
      userId: z.string(),
      itemId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {

      return ctx.db.cartItem.deleteMany({
        where: { id: input.itemId, cart: { userId: input.userId} },
      });
    }),

  /* 5. 清空购物车 */
  clear: t.procedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {

      const cart = await ctx.db.cart.findUnique({
        where: { userId: input.userId },
      });
      if (!cart) return 0;

      const { count } = await ctx.db.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      return count;
    }),
});
