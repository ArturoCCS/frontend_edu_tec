import { useUserStore } from '@/stores/userStore.js';
import axios from 'axios';
import Cookies from "js-cookie";
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || Cookies.get("token") || null,
  }),
  actions: {
    async register(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/auth/register', credentials);
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: "error", message: error.response?.data?.message || 'Error en la autenticación' };
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', credentials, { withCredentials: true });
        this.token = response.data.token;
        localStorage.setItem('token', response.data.token);
        Cookies.set('token', response.data.token);
        if (response.data.user) {
          this.user = response.data.user;
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: "error", message: error.response?.data?.message || 'Error en la autenticación' };
      }
    },
    async logout() {
      try {
        await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
      } catch (e) {
      }
      const userStore = useUserStore();
      userStore.$reset();
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      Cookies.remove('token');
    },
    loadFromLocalStorage() {
      this.token = localStorage.getItem('token') || Cookies.get("token") || null;
      const user = localStorage.getItem('user');
      this.user = user ? JSON.parse(user) : null;
    },
    withGoogle() {
      window.location.href = 'http://localhost:3000/auth/google';
    },
    withMicrosoft() {
      window.location.href = 'http://localhost:3000/auth/microsoft';
    },
    async confirmEmail(token) {
      try {
        const response = await axios.get(`http://localhost:3000/auth/confirm/${token}`);
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: 'error', message: error.response?.data?.message || 'Error al confirmar el correo' };
      }
    },
    async checkAuth() {
      try {
        const response = await axios.get('http://localhost:3000/auth/check-auth', { withCredentials: true });
        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.token = response.data.token || localStorage.getItem('token') || Cookies.get('token');
        localStorage.setItem('token', this.token);
        Cookies.set('token', this.token);
        return { status: response.data.status , message: response.data.message };
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        return { status: "error", message: error.response?.data?.message || 'No autenticado o sin permisos' };
      }
    } 
  }
});