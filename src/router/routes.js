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
  },
  {
    path: '/login',
    component: () => import('../pages/login.vue'),
  },
  //Ejemplo ruta protegida al iniciar sesion 
  {
    path: '/protected_route',
    //Ejemplo de direccionamiento de ruta protegida
    component: () => import('../pages/protected_route.vue'),
  },
]