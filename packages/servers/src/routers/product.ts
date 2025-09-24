import { t } from "../trpc";
import { z } from 'zod'

export const productRouter = t.router({
  getlist: t.procedure
    .query(async ({ ctx }) => {
      return ctx.db.product.findMany({
        include: { category: { select: { id: true, name: true } } },
      });

    }),
  getlistOnLogin: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const products = await ctx.db.product.findMany({
        include: {
          category: { select: { id: true, name: true } },
          favorites: { where: { userId: input.userId }, select: { id: true } },
        },
      });

      return products.map((p) => ({
        ...p,
        isFavorite: p.favorites.length > 0,
        favorites: undefined,
      }));
    }),
  getById: t.procedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.product.findFirst({
        where: { id: input.id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          }
        }
      })
    }),
  getByCategory: t.procedure
    .input(z.object({
      categoryId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.product.findMany({
        where: { categoryId: input.categoryId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          }
        }
      })
    }),
  getByCategoryOnLogin: t.procedure
    .input(z.object({
      userId: z.string(),
      categoryId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const temp = await ctx.db.product.findMany({
        where: { categoryId: input.categoryId },
        include: {
          category: { select: { id: true, name: true } },
          favorites: { where: { userId: input.userId }, select: { id: true } }
        }
      })

      return temp.map((p) => ({
        ...p,
        isFavorite: p.favorites.length > 0,
        favorites: undefined
      }));
    })
})

