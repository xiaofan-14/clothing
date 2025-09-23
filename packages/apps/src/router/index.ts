import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const baseURL = import.meta.env.VITE_BASE_URL;

const router = createRouter({
  history: createWebHistory(baseURL),
  routes,
});

router.beforeEach(async (_to, _from, next) => {
  next();
});

router.afterEach((_to) => {});

export default router;
