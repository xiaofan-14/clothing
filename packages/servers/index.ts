import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import path from "path";
import { appRouter } from "./src/routers";

async function server() {
  const app = express();
  app.use(cors());

  // 静态资源服务
  app.use("/assets", express.static(path.resolve(__dirname, "assets")));

  // tRPC
  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    })
  );

  // 前端入口
  app.get("/", (_req, res) => {
    res.redirect("http://localhost:5173");
  });

  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
}

server();
