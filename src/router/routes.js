import ConfirmEmail from '@/components/Auth/ConfirmEmail.vue';
import ForgotPassword from '@/components/Auth/ForgotPassword.vue';
import LoginForm from '@/components/Auth/LoginForm.vue';
import RegisterForm from '@/components/Auth/RegisterForm.vue';
import ResetPasswordForm from '@/components/Auth/ResetPasswordForm.vue';
import BlogForm from '@/components/Blog/Create/BlogForm.vue';
import BlogList from '@/components/Blog/View/BlogList.vue';

const routes = [
  {
    path: '/',
    component: () => import('../pages/index.vue'),
    
  },
  {
    path: '/register',
    component: RegisterForm,
  },
  {
    path: '/confirm/:token',
    component: ConfirmEmail,
  },
  {
    path: '/confirmation-required',
    component: () => import('../pages/confirmationRequired.vue')
  },
  {
    path: '/login',
    component: LoginForm,
  },
  { 
    path: '/protected-route', 
    component: () => import('../pages/protected_route.vue'),
    meta: { requiresAuth: true, requiresPermission: true }
  },
  { 
    path: '/reset-password/:recoveryToken', 
    component: ResetPasswordForm
  },
  { path: '/forgot-password', component: ForgotPassword },
  {
    path: '/blog/:id',
    name: 'Blog',
    component: () => import('../pages/blogView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/listaLibros',
    name: 'Libro',
    component: () => import('../pages/librosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/listaBlogs/',
    name:'ListadoBlog',
    component: BlogList
  },
  {
    path: '/simulador/',
    name:'Simulador',
    component: () => import('../pages/simulador.vue'),
  },
  {
    path: '/cuestionario/',
    name:'Cuestionario',
    component: () => import('../pages/cuestionario.vue'),
  },
  {
  path: '/reticula/',
  name:'Reticula',
  component: () => import('../pages/reticula.vue'),
},
  {
    path: '/about',
    component: BlogForm,
  }
]

export default routes;