import { useToast } from "@/composables/useToast";
import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const baseURL = import.meta.env.VITE_BASE_URL;

const router = createRouter({
  history: createWebHistory(baseURL),
  routes,
});

router.beforeEach(async (_to, _from, next) => {
  const auth = useAuthStore()
  const { toast } = useToast()

  const user = auth.user!

  if (!user && _to.path === '/favorites') {
    toast('请先登录', 'info')
    next('/signin')
    return
  }


  next();
});

router.afterEach((_to) => { });

export default router;
