import { useAuthStore } from '@/stores/authStore.js';
import Cookies from "js-cookie";
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.token) {
    authStore.token = Cookies.get("token") || null;
  }

  if (to.meta.requiresAuth) {
    try {
      const authStatus = await authStore.checkAuth();

      if (authStatus.status === 'success') {
        next();
      } else {
        next('/login');
      }
    } catch (error) {
      console.error("Error al verificar autenticación", error);
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
