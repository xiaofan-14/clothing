import { initTRPC } from "@trpc/server";

// 这里可以放全局上下文、middleware 等
export const t = initTRPC.create();
