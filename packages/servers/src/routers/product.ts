import { t } from "../trpc";
import { z } from 'zod'

export const productRouter = t.router({
  getlist: t.procedure
    .input(z.object({
      userId: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {
      const { userId } = input
      if (userId !== undefined && userId !== null) {
        return await ctx.db.product.findMany({
          include: { category: { select: { id: true, name: true } } },
        });
      }
      const temp = await ctx.db.product.findMany({
        include: {
          category: { select: { id: true, name: true } },
          favorites: {
            where: { userId }
          }
        },
      })
      
      return temp.map(e => {
        return {
          ...e,
          isFavorite: e.favorites
        }
      })
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
})

