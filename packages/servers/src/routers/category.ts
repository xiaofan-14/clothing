import { t } from "../trpc";

export const categoryRouter = t.router({
  getlist: t.procedure
    .query(async ({ ctx }) => {
      return await ctx.db.category.findMany();
    })
})

