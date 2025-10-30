import { useAuthStore } from '@/stores/authStore.js';
import { useUserStore } from '@/stores/userStore.js';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      const authStatus = await authStore.checkAuth();
      if (authStatus.status !== 'success') return next('/login');
    }

    if (to.meta.requiresPermission) {
      const user = authStore.user;
      if (user.id_rol === Number(import.meta.env.VITE_APP_ROL_ADMIN)) return next();

      const hasPermission = userStore.permissions.includes(to.meta.permission);
      if (!hasPermission) return next('/'); 
    }
  }

  next();
});


export default router;
