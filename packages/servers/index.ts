import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import z from "zod";
import express from "express";
import cors from "cors";

import { signin, signup, signout } from './src/auth'
const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure.input(z.string().nullish()).query((req) => {
    return `hello ${req.input}`
  })
});

export type AppRouter = typeof appRouter;

async function server() {
  // express implementation
  const app = express();
  app.use(cors());
  app.use((req, _res, next) => {
    // request logger
    console.log("⬅️ ", req.method, req.path, req.body ?? req.query);

    next();
  });

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    }),
  );
  app.get("/", (_req, res) => {
    res.redirect("http://localhost:5173");
  });
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
}

server();
