import { t } from "../trpc";
import { z } from 'zod'

export const productRouter = t.router({
  getlist: t.procedure
    .query(async ({ ctx }) => {
      return await ctx.db.product.findMany({
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
    })
})

