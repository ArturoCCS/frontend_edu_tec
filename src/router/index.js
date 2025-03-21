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
    if (!authStore.token) {
      try {
        const authStatus = await authStore.checkAuth();
        if (authStatus.status !== 'success') {
          return next('/login');
        }
      } catch (error) {
        console.error("Error al verificar autenticación", error);
        return next('/login');
      }
    }

    if (to.meta.requiresPermission) {
      try {
        if (userStore.permissions.length === 0) {
          userStore.user = authStore.user;
          const userPermission = await userStore.checkPermission();

          if (userPermission.status !== 'success') {
            return next('/'); 
          }
        }
      } catch (error) {
        console.error("Error al verificar permisos", error);
        return next('/'); 
      }
    }
  }

  next();
});

export default router;
