import BlogView from '@/components/BlogView.vue';
import ConfirmEmail from '@/components/ConfirmEmail.vue';
import ForgotPassword from '@/components/ForgotPassword.vue';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import ResetPasswordForm from '@/components/ResetPasswordForm.vue';

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
  component: BlogView,
}

]

export default routes;