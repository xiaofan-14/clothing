import { createTRPCVue } from "@trpc-vue-query/client";
import type { AppRouter } from '@clothing/servers/src/routers';

const trpc = createTRPCVue<AppRouter>()

// export const trpc = trpcClient as typeof trpcClient


export default { trpc  }
