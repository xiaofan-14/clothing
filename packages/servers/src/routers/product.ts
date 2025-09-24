import { t } from "../trpc";

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
    })
})

