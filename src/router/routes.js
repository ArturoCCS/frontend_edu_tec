const routes = [
  {
    path: '/',
    component: () => import('../pages/index.vue'),
    
  },
  {
    path: '/ejemplo',
    component: () => import('../pages/ejemplo.vue'),
  },
  {
    path: '/ejemplo2',
    component: () => import('../pages/ejemplo2.vue'),
  },
  {
    path: '/register',
    component: () => import('../pages/register.vue'),
  }
]