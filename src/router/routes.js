const routes = [
  {
    path: '/',
    component: () => import('../pages/index.vue'),
    
  },
  {
    path: '/register',
    component: () => import('../pages/register.vue'),
  },
  {
    path: '/confirm/:token',
    name: 'confirmEmail',
    component: () => import('../pages/confirmEmail.vue')
  },
  {
    path: '/confirmation_required',
    component: () => import('../pages/confirmationRequired.vue'),
    name: 'confirmationRequired'
  },
  {
    path: '/login',
    component: () => import('../pages/login.vue'),
  },
  { 
    path: '/protected_route', 
    component: () => import('../pages/protected_route.vue'),
    meta: { requiresAuth: true } 
  },
]

export default routes;