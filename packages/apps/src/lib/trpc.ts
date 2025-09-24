import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from "@clothing/servers/src/routers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BASE_URL}/trpc`,
      // You can pass any HTTP headers you wish here
      // async headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   };
      // },
    }),
  ],
})

