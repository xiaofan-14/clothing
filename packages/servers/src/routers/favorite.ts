import { z } from 'zod';
import { t } from '../trpc';

export const favoriteRouter = t.router({
  /* 1. 添加 / 取消收藏（toggle：存在就删，不存在就加） */
  toggle: t.procedure
    .input(z.object({
      userId: z.string(),
      productId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {

      const existing = await ctx.db.favorite.findUnique({
        where: { userId_productId: { userId: input.userId, productId: input.productId } },
      });

      if (existing) {
        await ctx.db.favorite.delete({ where: { id: existing.id } });
        return { isFavorite: false };
      }

      await ctx.db.favorite.create({
        data: { userId: input.userId, productId: input.productId },
      });
      return { isFavorite: true };
    }),

  /* 2. 我的收藏列表（分页） */
  list: t.procedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().min(1).max(50),
      cursor: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {

      const favorites = await ctx.db.favorite.findMany({
        where: { userId: input.userId },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: {
          product: {
            include: {
              category: true
            }
          }
        },
      });

      let nextCursor: string | undefined;
      if (favorites.length > input.limit) {
        nextCursor = favorites.pop()!.id;
      }

      return {
        items: favorites.map(f => ({
          ...f.product,
          isFavorite: true,
        })),
        nextCursor,
      };
    }),

  /* 3. 批量判断是否已收藏（用于商品列表心形图标） */
  checkMany: t.procedure
    .input(z.object({
      userId: z.string(),
      productIds: z.array(z.string())
    }))
    .output(z.array(z.object({ productId: z.string(), isFavorite: z.boolean() })))
    .query(async ({ input, ctx }) => {
      if (!input.userId) return input.productIds.map(id => ({ productId: id, isFavorite: false }));

      const rows = await ctx.db.favorite.findMany({
        where: { userId: input.userId, productId: { in: input.productIds } },
        select: { productId: true },
      });
      const set = new Set(rows.map(r => r.productId));
      return input.productIds.map(id => ({ productId: id, isFavorite: set.has(id) }));
    }),
});
