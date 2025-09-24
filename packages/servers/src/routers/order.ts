import { t } from '../trpc'
import { z } from 'zod'

const OrderItemInputSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
});

export const orderRouter = t.router({
  /* 1. 创建订单 */
  create: t.procedure
    .input(z.object({
      userId: z.string(),
      items: z.array(OrderItemInputSchema),
    }))
    .mutation(async ({ input, ctx }) => {

      const products = await ctx.db.product.findMany({
        where: { id: { in: input.items.map(i => i.productId) } },
        select: { id: true, price: true, stock: true, name: true, image: true },
      });

      let total = 0;
      const orderItems = input.items.map(i => {
        const p = products.find(pr => pr.id === i.productId)!;
        total += p.price * i.quantity;

        return {
          productId: i.productId,
          quantity: i.quantity,
          price: p.price,          // 快照价
        };
      });

      await ctx.db.order.create({
        data: {
          userId: input.userId,
          total,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });
      await ctx.db.cartItem.deleteMany({ where: { cart: { userId: input.userId } } });
    }),

  /* 2. 我的订单列表（分页） */
  list: t.procedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().min(1).max(50),
      cursor: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {

      const orders = await ctx.db.order.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: 'desc' },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { items: { include: { product: true } } },
      });

      let nextCursor: string | undefined;
      if (orders.length > input.limit) {
        nextCursor = orders.pop()!.id;
      }
      return { orders, nextCursor };
    }),

  /* 3. 订单详情 */
  // byId: t.procedure
  //   .input(z.object({ id: z.string() }))
  //   .output(OrderSchema)
  //   .query(async ({ input, ctx }) => {
  //     const order = await ctx.db.order.findFirst({
  //       where: { id: input.id, userId: ctx.user?.id },
  //       include: { items: { include: { product: true } }, address: true },
  //     });
  //     if (!order) throw new TRPCError({ code: 'NOT_FOUND' });
  //     return order;
  //   }),

});
