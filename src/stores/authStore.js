import { useUserStore } from '@/stores/userStore.js';
import axios from 'axios';
import Cookies from "js-cookie";
import { defineStore } from 'pinia';
const VITE_APP_URL_BACKEND = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:3000';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || Cookies.get("token") || null,
  }),
  actions: {
    async register(credentials) {
      try {
        const response = await axios.post(`${VITE_APP_URL_BACKEND}/auth/register`, credentials);
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: "error", message: error.response?.data?.message || 'Error en la autenticación' };
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post(`${VITE_APP_URL_BACKEND}/auth/login`, credentials, { withCredentials: true });
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
        await axios.post(`${VITE_APP_URL_BACKEND}/auth/logout`, {}, { withCredentials: true });
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
      window.location.href = `${VITE_APP_URL_BACKEND}/auth/google`
    },
    withMicrosoft() {
      window.location.href = `${VITE_APP_URL_BACKEND}/auth/microsoft`
    },
    async confirmEmail(token) {
      try {
        const response = await axios.get(`${VITE_APP_URL_BACKEND}/auth/confirm/${token}`);
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: 'error', message: error.response?.data?.message || 'Error al confirmar el correo' };
      }
    },
    async checkAuth() {
      try {
        const token = this.token || localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');

        const response = await axios.get(`${VITE_APP_URL_BACKEND}/auth/check-auth`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { status: 'error', message: error.response?.data?.message || 'No autenticado' };
      }
    }
  }
});