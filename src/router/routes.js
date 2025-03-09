const routes = [
  {
    path: '/',
    component: () => import('../pages/index.vue'),
    
  },
  {
    path: '/ejemplo',
    component: () => import('../pages/ejemplo.vue'),
  }
]